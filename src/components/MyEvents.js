import { Link } from "react-router-dom";
import {WeddingEventsContext} from "./Main"
import { useContext } from "react"

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
    
    console.log(allEvents)

    return (
        <div className="event-root-container">
            { allEvents
                ? allEvents.map(event => <EventCard key={event._id} event={event}/>)
                : <h1>Loading Events...</h1>
            }
        </div>
    );
}