import { useParams } from "react-router-dom"
import { useContext } from "react"
import { WeddingEventsContext } from "./MyEvents"

export function Locations(){

    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]
    console.log(concreteEvent)

    return (
        <div className="event-detail-locations-conteiner">
            <h1 className="event-details-title-body-section">Locations</h1>
            <textarea className="event-detail-locations" name="locations" defaultValue={concreteEvent.locations}></textarea>
        </div>
    )
}