import { useParams } from "react-router-dom"
import { useEffect, useState} from "react"
import { fetchME } from "../fetchMe"


function MealsCard(prop){
    let listMeal = prop.listMeal
    let type = prop.type
    let MainTitle = prop.MainTitle
    return (
        <>
            <label htmlFor={`event-guest-view-${type}`}>{MainTitle}</label>

            <select className="event-guest-view-selects" name={`event-guest-view-${type}`}>
                { listMeal.length !== 0
                    ?
                        listMeal.map(obj => 
                            <option key={obj._id}>{obj.title}</option>
                        )
                    :   <option>No {MainTitle}</option>

                }
            </select>
        </>
    )
}

function DrinkCard(prop){
    let listMeal = prop.listMeal
    let type = prop.type
    let MainTitle = prop.MainTitle
    return(
        <>
            <label htmlFor={`event-guest-view-${type}`}>{MainTitle}</label>
            {
                listMeal.map(obj =>

                    <div key={obj._id} className="event-guest-view-chekBox-div-conteiner">
                        <label htmlFor={`${obj._id}-${type}`}>{obj.title}</label>
                        <input type="checkbox" className='event-guest-view-chekBoxes' name={`${obj._id}-${type}`} value={obj.title}/>
                    </div>

                )
            }

        </>
    )

}

export function EventGuestView(){

    let eventID = useParams().eventId
    let [concreteEvent, changeEvents] = useState("");

    useEffect(() => {
        fetchME("GET", `/event/${eventID}`, {}) //localStorage.getItem('GuestUser')
            .then(response => {
                if (response.status === 401){
                    localStorage.clear()
                    window.location.replace('/login')
                }
                else {
                    return response.json()
                }
            })
            .then(events => { 
                console.log(events)
                changeEvents(events)
            })
            .catch(err => {
                console.log(err)
            })

    }, [eventID])

    console.log(concreteEvent)

    const AllMeals = [
        [concreteEvent.salads, 'salads', "Salads"],
        [concreteEvent.appetizers, 'appetizers', "Appetizers"],
        [concreteEvent.mains, 'mains', "Main Meals"],
        [concreteEvent.afterMeals, 'afterMeals', 'After Meals'],
        [concreteEvent.alcohols, 'alcohols', "Alcoholic Drinks"],
        [concreteEvent.softs, 'softs', "Soft Drinks"],
    ]
    
    function OnSub(e) {
        e.preventDefault();
        let payload = new FormData(e.currentTarget)
        console.log('Payload:', Object.fromEntries(payload.entries()))
        payload = Object.fromEntries(payload.entries())

        fetchME("POST", `/event/vote/${eventID}`, payload, localStorage.getItem('GuestUser'))
            .then(response => {
                if (response.status === 401){
                    localStorage.clear()
                    window.location.replace('/login')
                }
                else {
                    return response.json()
                }
            })
            .then(guest => { 
                console.log(guest)
                
                if (guest.accessToken){
                    localStorage.setItem("GuestUser", guest.accessToken)
                }
                
                // window.location.replace("/goodjob")
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    console.log("concreteEvent: ", concreteEvent)
    return (
        <>
            { concreteEvent
                ?
                    <form className="event-guest-view-form" onSubmit={OnSub}>
                        <h1>Wedding Survey</h1>
                        <label htmlFor="email">Email*</label>
                        <input className="event-guest-view-data" type="text" name="email" placeholder="email..."/>
                        
                        <label htmlFor="guestName">Name*</label>
                        <input className="event-guest-view-data" type="text" name="guestName" placeholder="First and Last name..."/>

                        {
                            AllMeals.map(([listMeal, type, MainTitle], index) => {

                                console.log(MainTitle)
                                if (type != 'alcohols' && type != 'softs'){
                                    return <MealsCard key={index} listMeal={listMeal} type={type} MainTitle={MainTitle}/>
                                }
                                if (type == 'alcohols' || type == 'softs'){
                                    return <DrinkCard key={index} listMeal={listMeal} type={type} MainTitle={MainTitle}/>
                                }
                                return <h1>Guest Component Here</h1>

                            })

                        }

                        <input type="submit" className="event-guest-view-action-btn-send" defaultValue="Send"/>

                    </form>
                    
                : 
                    <h1>Event was Deleted or Not Found!</h1>
            }
        </>
        
    )
}