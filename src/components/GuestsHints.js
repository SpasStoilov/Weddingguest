import { useParams } from "react-router-dom"
import { useContext } from "react"
import { WeddingEventsContext } from "./MyEvents"

export function GuestsHints(){
    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]
    console.log(concreteEvent)
    
    return (
        <div className="event-detail-hints-conteiner">
            <h1 className="event-details-title-body-section">Hints</h1>
            <textarea className="event-detail-hints" name="hints" defaultValue={concreteEvent.hints}></textarea>
        </div>
    )
}