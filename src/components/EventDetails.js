import { useParams } from "react-router-dom"

export function EventDetails(){
    let eventID = useParams().eventId
    return (
        <div className="event-detail-conteiner">EventDetails: {eventID}</div>
    )
}