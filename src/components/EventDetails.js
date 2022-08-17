import { Link, Outlet } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { useContext} from 'react'
import { WeddingEventsContext } from './Main'
import { fetchME } from '../fetchMe'


export function EventDetails() {
    
    let eventID = useParams().eventId
    const path = `/user/events/update/${eventID}`
    let allEvents = useContext(WeddingEventsContext)
    
    console.log(allEvents)

    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]
    // let saladsIds = concreteEvent.salads.map(obj => obj._id)
    // let appetizersIds = concreteEvent.appetizers.map(obj => obj._id)
    // let mainsIds = concreteEvent.mains.map(obj => obj._id)
    // let afterMealsIds = concreteEvent.afterMeals.map(obj => obj._id)
    // let alcoholsIds = concreteEvent.alcohols.map(obj => obj._id)
    // let softsIds = concreteEvent.softs.map(obj => obj._id)
    // let menuIDS = {
    //     saladsIds,
    //     appetizersIds,
    //     mainsIds,
    //     afterMealsIds,
    //     alcoholsIds,
    //     softsIds
    // }
    
    async function OnSub(e){
        e.preventDefault();
        let payload = new FormData(e.currentTarget)
        console.log('Payload:', payload)
        
        try {
            let response = await fetchME("POST", path, payload, localStorage.getItem('user'), true)
            console.log(response)

            //redirect to /myevents
        }
        catch (err){
            console.log(err.message)
        }
        
    }

    return (
        <form className="event-detail-conteiner" onSubmit={OnSub}>
            
            <div className="event-detail-head">
                <div className="event-detail-head-img">
                    <img className="event-img" src={concreteEvent.imageUrl} alt="Event IMG"/>
                </div>
                <div className="event-detail-head-headers">
                    <h2 className="event-detail-head-headers-title">{concreteEvent.title}</h2>
                    <h3 className="event-detail-head-headers-guest">Total Guests: {`${concreteEvent.guests.length}`}</h3>
                    <h3 className="event-detail-head-headers-link">Share: {`weddingguest.com/event?ID=${concreteEvent._id}`}</h3>
                </div>
            </div>

            <div className="event-detail-menu">
                <Link to={'head/'+ eventID}>Title</Link>
                <Link to={'fooddrinks/' + eventID}>Menu</Link>
                <Link to={'locations/'+ eventID}>Locations</Link>
                <Link to={'guest/hints/'+ eventID}>Hints</Link>
                <Link to={'guest/'+ eventID}>Guests</Link>
            </div>

            <div className="event-detail-body">
               <Outlet/>
            </div>

            <div className="event-detail-body-actions">
                <input type="submit" className="event-detail-actions-save" defaultValue="Save"/>
                <input type="click" className="event-detail-actions-delete" defaultValue="Delete"/>
            </div>

        </form>
    )
}