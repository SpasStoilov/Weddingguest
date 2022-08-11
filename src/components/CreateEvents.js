import { MultiCard } from "./FoodDrinks";
import { useState, useEffect } from "react"
import { formDataFunc } from "../getFormData"

let dataSalads = [
    {_id: 'S-0', title:'S-0', recepie: 'Recepie here...', vote: ''},
]

let dataAppetizers = [
    {_id: 'A-0', title:'A-0', recepie: 'Recepie here...', vote: ''},
]

let dataMainMeal = [
    {_id: 'M-0', title:'M-0', recepie: 'Recepie here...', vote: ''},
]

let dataDesert = [
    {_id: 'D-0', title:'D-0', recepie: 'Recepie here...', vote: ''},
]

let dataAlcohol = [
    {_id: 'L-0', title:'L-0', recepie: '', vote: ''},
]

let dataSoft = [
    {_id: 'F-0', title:'F-0', recepie: '', vote: ''},
]

export function CreateEvents() {

    let [saladList, editSaladList] = useState(dataSalads)
    let [appetizerList, editAppetizerList] = useState(dataAppetizers)
    let [mainList, editMainList] = useState(dataMainMeal)
    let [desertList, editDesertList] = useState(dataDesert)
    let [alcoholList, editAlcoholList] = useState(dataAlcohol)
    let [softList, editSoftList] = useState(dataSoft)

    let saladEditObj = { getAll: saladList, editThem: editSaladList}
    let appetizerEditObj = { getAll: appetizerList, editThem: editAppetizerList}
    let mainEditObj = { getAll: mainList, editThem: editMainList}
    let desertEditObj = { getAll: desertList, editThem: editDesertList}
    let alcoholEditObj = { getAll: alcoholList, editThem: editAlcoholList}
    let softEditObj = { getAll: softList, editThem: editSoftList}

    let Menu = [
        {Title: 'Salads', NameOfClass: 'event-create-Salads', listItems: saladList, Editor: saladEditObj, Flag: "-Salad", Mark: "S"},
        {Title: 'Appetizers', NameOfClass: 'event-create-Appetizers', listItems: appetizerList, Editor: appetizerEditObj, Flag: "-Appetizer", Mark: "A"},
        {Title: 'Main Meals', NameOfClass: 'event-create-MainMeals', listItems: mainList, Editor: mainEditObj, Flag: "-Main", Mark: "M"},
        {Title: 'Deserts', NameOfClass: 'event-create-Deserts', listItems: desertList, Editor: desertEditObj, Flag: "-Desert", Mark: "D"},
        {Title: 'Alcoholic Drinks', NameOfClass: 'event-create-Alcohol', listItems: alcoholList, Editor: alcoholEditObj, Flag: "-Alcohol", Mark: "L"},
        {Title: 'Soft Drinks', NameOfClass: 'event-create-Soft', listItems: softList, Editor: softEditObj, Flag: "-Soft", Mark: "F"}
    ]

    function LoadFile(e){
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            console.log(reader.result)
            e.target.style.backgroundImage = `url(${reader.result})`
        })
        
        reader.readAsDataURL(e.target.files[0]);
    }

    function onSubmitData (e) {
        e.preventDefault();
        console.log('hello Form!')
        let dataFromForm = formDataFunc(e.currentTarget)
        console.log(dataFromForm)
    }

    useEffect(() => {
        console.log('hello useEffect!')
        let formEl = document.querySelector('.creat-event-form')
        formEl.addEventListener('submit', onSubmitData)

        return () => {
            formEl.removeEventListener('submit', onSubmitData)
        };
    })

    return (
        <form className="creat-event-form">

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



// // inputImage background logic:

// formInputImageHolder.addEventListener('change', onChangePicInput)
// function onChangePicInput(e){
//     if (e.target.nodeName == "INPUT"){

//         let reader = new FileReader()
//         reader.addEventListener('load', () => {
//             console.log(reader.result)
//             e.target.style.backgroundImage = `url(${reader.result})`
//         })

//         console.log("CTX: ", e.target)
//         console.log("CTX: ", e.target.files)
//         console.log("INF about pic upload: ", e.target.files[0])
//         reader.readAsDataURL(e.target.files[0]);
//     }
// };