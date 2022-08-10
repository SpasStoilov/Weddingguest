import { Link, Outlet } from 'react-router-dom'
import { useParams } from "react-router-dom"

export function EventDetails(){
    
    let eventID = useParams().eventId

    return (
        <div className="event-detail-conteiner">
            
            <div className="event-detail-head">
                <div className="event-detail-head-img">
                    <img className="event-img" src="https://www.magenboys.com/images/photo_galleries/gallery/large_1382114157.jpg" alt="Event IMG"/>
                </div>
                <div className="event-detail-head-headers">
                    <h2 className="event-detail-head-headers-title">My Wedding Title</h2>
                    <h3 className="event-detail-head-headers-guest">Total Guests: 0</h3>
                    <h3 className="event-detail-head-headers-link">Share: weddingguest.com/event?ID=531658566565</h3>
                </div>
            </div>

            <div className="event-detail-menu">
                <Link to={'fooddrinks/' + eventID}>Food/Drinks</Link>
                <Link to={'locations/'+ eventID}>Locations</Link>
                <Link to={'guest/hints/'+ eventID}>Hints for the Guests</Link>
                <Link to={'guest/'+ eventID}>Guests</Link>
            </div>

            <div className="event-detail-body">
               <Outlet/>
            </div>

        </div>
    )
}