import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useState } from "react"


let dataSalads = [
    {_id: '455461', title:'Title1', recepie: 'SRecepie1'},
    {_id: '24444', title:'Title2', recepie: 'SRecepie2'},
    {_id: 'S-0', title:'S-0', recepie: ''},
    {_id: 'S-1', title:'S-1', recepie: ''}
]

let dataAppetizers = [
    {_id: 'fdfdfd', title:'Title1', recepie: 'ARecepie1'},
    {_id: 'aaasss', title:'Title2', recepie: 'ARecepie2'},
    {_id: 'A-0', title:'A-0', recepie: ''},
    {_id: 'A-1', title:'A-1', recepie: ''}
]

let dataMainMeal = [
    {_id: 'fdnhnnfdfd', title:'Title1', recepie: 'MRecepie1'},
    {_id: 'aaannnsss', title:'Title2', recepie: 'MRecepie2'},
    {_id: 'M-0', title:'M-0', recepie: ''},
    {_id: 'M-1', title:'M-1', recepie: ''}
]

let dataDesert = [
    {_id: 'fdnhnnfdfd', title:'Title1', recepie: 'DRecepie1'},
    {_id: 'aaannnsss', title:'Title2', recepie: 'DRecepie2'},
    {_id: 'D-0', title:'D-0', recepie: ''},
    {_id: 'D-1', title:'D-1', recepie: ''}
]


function MultiCard(props){

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

        if (lastSaladInList._id.startsWith(`${props.mark}-`)){
            newId = props.mark + '-' + (Number(lastSaladInList._id.slice(2)) + 1)

        }
        newList.push({_id: newId, title: newId, recepie: ''})
        props.inMenu.editThem(newList)
    }

    return (
        <div className={props.flagType}>
            <input name={props.title + props.flagType} defaultValue={props.title} type="text"/>
            <textarea name={props.title + props.flagType + "-recepie"} defaultValue={props.recepie}></textarea>
            <div className="event-meals-types-actions">
                <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
            </div>
        </div>
    )
}


export function FoodDrinks(){

    let eventID = useParams().eventId
    let [saladList, editSaladList] = useState(dataSalads)
    let [appetizerList, editAppetizerList] = useState(dataAppetizers)
    let [mainList, editMainList] = useState(dataMainMeal)
    let [desertList, editDesertList] = useState(dataDesert)

    let saladEditObj = { getAll: saladList, editThem: editSaladList}
    let appetizerEditObj = { getAll: appetizerList, editThem: editAppetizerList}
    let mainEditObj = { getAll: mainList, editThem: editMainList}
    let desertEditObj = { getAll: desertList, editThem: editDesertList}

    return (

        <form className="event-detail-form-FoodDrinks">

            <h1>Salads</h1>
            <div className="event-detail-body-Salads">
                {
                    saladList.map(obj => <MultiCard key={obj._id} title={obj.title} inMenu={saladEditObj} recepie={obj.recepie} flagType="-Salad" mark="S"/>)
                }
            </div>

            <h1>Appetizers</h1>
            <div className="event-detail-body-Appetizers">
                {
                    appetizerList.map(obj => <MultiCard key={obj._id} title={obj.title} inMenu={appetizerEditObj} recepie={obj.recepie} flagType="-Appetizer" mark="A"/>)
                }
            </div>

            <h1>Main Meals</h1>
            <div className="event-detail-body-MainMeals">
                {
                    mainList.map(obj => <MultiCard key={obj._id} title={obj.title} inMenu={mainEditObj} recepie={obj.recepie} flagType="-Main" mark="M"/>)
                }
            </div>
            
            <h1>Deserts</h1>
            <div className="event-detail-body-Deserts">
                {
                    desertList.map(obj => <MultiCard key={obj._id} title={obj.title} inMenu={desertEditObj} recepie={obj.recepie} flagType="-Desert" mark="D"/>)
                }
            </div>

            {/* <h1>Alcoholic Drinks</h1>
            <div className="event-detail-body-Alcohol">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <h1>Soft Drinks</h1>
            <div className="event-detail-body-Soft">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div> */}

            <div className="event-detail-body-actions">

                {/* Guest */}
                <Link className="event-detail-body-actions-send" to='/guests/vote/guestId'>Send</Link>

                {/* Logged */}
                <Link className="event-detail-body-actions-save" to='/events/save/eventId'>Save</Link>
                {/* <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button> */}

            </div>

        </form>
    )
}