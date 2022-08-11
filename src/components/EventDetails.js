import { Link, Outlet } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { useContext } from 'react'
import { WeddingEventsContext } from '../App'

export function EventDetails() {
    
    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]
   
    return (
        <form className="event-detail-conteiner">
            
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
                <Link to={'fooddrinks/' + eventID}>Menu</Link>
                <Link to={'locations/'+ eventID}>Locations</Link>
                <Link to={'guest/hints/'+ eventID}>Hints</Link>
                <Link to={'guest/'+ eventID}>Guests</Link>
            </div>

            <div className="event-detail-body">
               <Outlet/>
            </div>

            <div className="event-detail-body-actions">
                <input type="submit" className="event-detail-actions-save" value="Save"/>
                <input type="submit" className="event-detail-actions-delete" value="Delete"/>
            </div>

        </form>
    )
}