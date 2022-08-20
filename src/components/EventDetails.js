import { Link, Outlet } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { useContext} from 'react'
import { WeddingEventsContext } from './Main'
import { fetchME } from '../fetchMe'


export function EventDetails() {
    
    let eventID = useParams().eventId
    let allEvents = useContext(WeddingEventsContext)
    const path = `/user/events/update/${eventID}`

    console.log(allEvents)

    let concreteEvent = allEvents.filter(evn => evn._id === eventID)[0]

    async function OnDelete(e){
        e.preventDefault();
        
        try {
            let response = await fetchME("DELETE", path, {}, localStorage.getItem('user'), true)
            console.log(response)
            if (response.status === 401){
                localStorage.clear();
                window.location.replace('/login');
            }
            window.location.replace('/myevents');
            
        }
        catch (err){
            console.log(err.message)
        }
        
    }

    async function OnSub(e){
        e.preventDefault();
        let payload = new FormData(e.currentTarget)
        console.log('Payload:', payload)

        try {
            let response = await fetchME('POST', path, payload, localStorage.getItem('user'), true)
            console.log(response)
            if (response.status === 401){
                localStorage.clear();
                window.location.replace('/login');
            }
            window.location.replace('/myevents');
            
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
                    <h3 className="event-detail-head-headers-link">Share: {`http://localhost:3000/event/${concreteEvent._id}`}</h3>
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
                <input type="submit" className="event-detail-actions-save"  value='Update'/>
                <input type="button" className="event-detail-actions-delete" defaultValue='Delete' onClick={OnDelete}/>
            </div>

        </form>
    )
}