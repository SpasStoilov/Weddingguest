import { Link } from "react-router-dom";
import { useContext } from "react";
import { WeddingEventsContext } from "../App";


function EventCard({event}){
    return (
        <div className="event-conteiner">
                <img className="event-img" src={event.imageUrl} alt="Event IMG"/>
                <h3 className="event-title">{event.title}</h3>
                <Link className="event-detail-button-link" to={"event/details/fooddrinks/" + event._id}>DETAILS</Link>
        </div>
    )
}

export function MyEvents() {

    let allEvents = useContext(WeddingEventsContext)
    
    return (
        <div className="event-root-container">
            {
                allEvents.map(event => <EventCard key={event._id} event={event}/>)
            }
        </div>
    );
}