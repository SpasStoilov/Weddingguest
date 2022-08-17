import { MultiCard } from "./FoodDrinks";
import { useState} from "react"
import { fetchME } from "../fetchMe"

// Default Templates Info:
let dataSalads = [
    {_id: 'S-0', title:'S-0', recepie: 'Recepie here...', vote: ''},
]

let dataAppetizers = [
    {_id: 'A-0', title:'A-0', recepie: 'Recepie here...', vote: ''},
]

let dataMainMeal = [
    {_id: 'M-0', title:'M-0', recepie: 'Recepie here...', vote: ''},
]

let dataAfterMeal = [
    {_id: 'D-0', title:'D-0', recepie: 'Recepie here...', vote: ''},
]

let dataAlcohol = [
    {_id: 'L-0', title:'L-0', recepie: '', vote: ''},
]

let dataSoft = [
    {_id: 'F-0', title:'F-0', recepie: '', vote: ''},
]
//----------------------------------------------------------------------------------

// AJX PATH:
const path = '/user/events/create'
//----------------------------------------------------------------------------------

export function CreateEvents() {

    let [saladList, editSaladList] = useState(dataSalads)
    let [appetizerList, editAppetizerList] = useState(dataAppetizers)
    let [mainList, editMainList] = useState(dataMainMeal)
    let [afterMealsList, editAfterMealsList] = useState(dataAfterMeal)
    let [alcoholList, editAlcoholList] = useState(dataAlcohol)
    let [softList, editSoftList] = useState(dataSoft)

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

    function LoadFile(e){
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            console.log(reader.result)
            e.target.style.backgroundImage = `url(${reader.result})`
        })
        
        reader.readAsDataURL(e.target.files[0]);
    }

    async function OnSub(e){
        e.preventDefault();
        let payload = new FormData(e.currentTarget)
        console.log(payload)

        try{
            let response = await fetchME("POST", path, payload, localStorage.getItem('user'), true)
            if (response.status === 401){
                localStorage.clear()
                window.location.replace('/login')
            }
            else {
                window.location.replace('/myevents')
            }
        }
        catch (err){
            console.log(err.message)
        }
        
    }

    return (
        <form className="creat-event-form" onSubmit={OnSub}>

            <div className="event-create-headers-conteiner">
                <input className="event-creat-form-imageUrl" name="imageUrl" type="file" onChange={LoadFile}/>
                <input type="text" className="event-create-title" name="title" defaultValue="Event Title..."/>
            </div>

            <textarea className="event-create-locations" name="locations" defaultValue="Some locations for the event..."></textarea>
            <textarea className="event-create-hints" name="hints" defaultValue="Some hints for your guests..."></textarea>

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
            <input type="submit" className="event-create-btn" value="Create"/>

        </form>
    );
}