import { useParams } from "react-router-dom"
import { useState, useContext } from "react"
import { WeddingEventsContext } from "./Main"

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

        let lastInList = newList[newList.length - 1]
        // let beforelastInList = newList[newList.length - 2]
        let newId = `${props.mark}-1`;
        let recepie = 'Recepie here...'

        if (lastInList._id.startsWith(`${props.mark}-`)){

            let idNum = Number(lastInList._id.slice(2))
            newId = props.mark + '-' + (idNum + 1)
            
        }
        if (props.mark === 'F' || props.mark === "L"){
            recepie = ''
        }

        newList.push({_id: newId, title: newId, recepie, vote: []})
        props.inMenu.editThem(newList)
    }

    return (
        <div className={props.flagType}>

            <input name={props.title + props.flagType} defaultValue={props.title} type="text"/>
            { 
                props.recepie && <textarea name={props.title + props.flagType + "-recepie"} defaultValue={props.recepie}></textarea>
            }

            <input type="hidden" name={props.title + props.flagType + '-ID'} defaultValue={props._id}/>

            <h4>Guests Vote: {props.vote.length}</h4>
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

    console.log(concreteEvent)

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
            <h1 className="event-details-title-body-section">Menu</h1>
            {
                Menu.map( getMe => {
                    return (
                        <div key={getMe.Title}>
                            <h1>{getMe.Title}</h1>
                            <div className={getMe.NameOfClass}>
                                {   
                                    getMe.listItems.map(obj => <MultiCard key={obj._id} _id={obj._id} title={obj.title} vote={obj.vote} inMenu={getMe.Editor} recepie={obj.recepie} flagType={getMe.Flag} mark={getMe.Mark}/>)
                                }

                            </div>
                        </div>
                    );

                })
            }

        </div>
    )
}