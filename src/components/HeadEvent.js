import { useParams } from "react-router-dom"
import { useContext } from "react"
import { WeddingEventsContext } from "./Main"

export function HeadEvent (){
    
    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]
    console.log(concreteEvent)

    function LoadFile(e){
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            console.log(reader.result)
            e.target.style.backgroundImage = `url(${reader.result})`
        })
        reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <div className="event-detail-guests-conteiner">
            <h1 className="event-details-title-body-section">Title</h1>

            <div className="event-create-headers-conteiner">
                <input className="event-creat-form-imageUrl" name="imageUrl" type="file" onChange={LoadFile}/>
                <input type="text" className="event-create-title" name="title" defaultValue={concreteEvent.title}/>
            </div>

        </div>
    )
}