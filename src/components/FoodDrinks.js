import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useState, useContext } from "react"
import { WeddingEventsContext } from "../App"

export function MultiCard(props){

    let [...newList] = props.inMenu.getAll

    function onDelete(e) {
        e.preventDefault()

        if (props.inMenu.getAll.length > 1) {
            let titleToRemove = e.target.parentElement.parentElement.querySelector('input').getAttribute('name')
            newList = newList.filter(obj => (obj.title + props.flagType) !== titleToRemove)
            props.inMenu.editThem(newList)
        }
        
    }

    function onAdd(e) {
        e.preventDefault();

        let lastSaladInList = newList[newList.length - 1]
        let newId = `${props.mark}-0`;
        let recepie = 'Recepie here...'

        if (lastSaladInList._id.startsWith(`${props.mark}-`)){
            newId = props.mark + '-' + (Number(lastSaladInList._id.slice(2)) + 1)

        }
        if (props.mark === 'F' || props.mark === "L"){
            recepie = ''
        }

        newList.push({_id: newId, title: newId, recepie, vote: '0'})
        props.inMenu.editThem(newList)
    }

    return (
        <div className={props.flagType}>

            <input name={props.title + props.flagType} defaultValue={props.title} type="text"/>
            { 
                props.recepie && <textarea name={props.title + props.flagType + "-recepie"} defaultValue={props.recepie}></textarea>
            }
            <h4>Guests Vote: {props.vote}</h4>
            <div className="event-meals-types-actions">
                <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
            </div>
        </div>
    )
}


export function FoodDrinks(){

    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]

    console.log(allEvents)

    let [saladList, editSaladList] = useState(concreteEvent.salads)
    let [appetizerList, editAppetizerList] = useState(concreteEvent.appetizers)
    let [mainList, editMainList] = useState(concreteEvent.mains)
    let [afterMealsList, editAfterMealsList] = useState(concreteEvent.afterMeals)
    let [alcoholList, editAlcoholList] = useState(concreteEvent.alcohols)
    let [softList, editSoftList] = useState(concreteEvent.softs)

    let saladEditObj = { getAll: saladList, editThem: editSaladList}
    let appetizerEditObj = { getAll: appetizerList, editThem: editAppetizerList}
    let mainEditObj = { getAll: mainList, editThem: editMainList}
    let afterMealsEditObj = { getAll: afterMealsList, editThem: editAfterMealsList}
    let alcoholEditObj = { getAll: alcoholList, editThem: editAlcoholList}
    let softEditObj = { getAll: softList, editThem: editSoftList}

    let Menu = [
        {Title: 'Salads', NameOfClass: 'event-detail-body-Salads', listItems: saladList, Editor: saladEditObj, Flag: "-Salad", Mark: "S"},
        {Title: 'Appetizers', NameOfClass: 'event-detail-body-Appetizers', listItems: appetizerList, Editor: appetizerEditObj, Flag: "-Appetizer", Mark: "A"},
        {Title: 'Main Meals', NameOfClass: 'event-detail-body-MainMeals', listItems: mainList, Editor: mainEditObj, Flag: "-Main", Mark: "M"},
        {Title: 'After Meals', NameOfClass: 'event-detail-body-afterMeals', listItems: afterMealsList, Editor: afterMealsEditObj, Flag: "-After", Mark: "D"},
        {Title: 'Alcoholic Drinks', NameOfClass: 'event-detail-body-Alcohol', listItems: alcoholList, Editor: alcoholEditObj, Flag: "-Alcohol", Mark: "L"},
        {Title: 'Soft Drinks', NameOfClass: 'event-detail-body-Soft', listItems: softList, Editor: softEditObj, Flag: "-Soft", Mark: "F"}
    ]

    return (

        <div className="event-detail-form-FoodDrinks">

            {
                Menu.map( getMe => {
                    return (
                        <div key={getMe.Title}>
                            <h1>{getMe.Title}</h1>
                            <div className={getMe.NameOfClass}>
                                {   
                                    getMe.listItems.map(obj => <MultiCard key={obj._id} title={obj.title} vote={obj.vote} inMenu={getMe.Editor} recepie={obj.recepie} flagType={getMe.Flag} mark={getMe.Mark}/>)
                                }

                            </div>
                        </div>
                    );

                })
            }

        </div>
    )
}