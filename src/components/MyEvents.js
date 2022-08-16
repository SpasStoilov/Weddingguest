import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
// import { allEvents } from '../eventData';
import { fetchME } from "../fetchMe"


export const WeddingEventsContext = React.createContext()

function EventCard({event}){
    return (
        <div className="event-conteiner">
                <img className="event-img" src={event.imageUrl} alt="Event IMG"/>
                <h3 className="event-title">{event.title}</h3>
                <Link className="event-detail-button-link" to={"event/details/fooddrinks/" + event._id}>DETAILS</Link>
        </div>
    )
}


const path = '/user/events'

export function MyEvents() {

    let [allEvents, changeEvents] = useState("");

    useEffect(() => {
        fetchME("GET", path, {}, localStorage.getItem('user'))
            .then(response => {
                if (response.status === 401){
                    window.location.replace('/login')
                }
                else if (response.status === 204){
                    return {}
                }
                else {
                    return response.json()
                }
            })
            .then(events => { 
                console.log(events)
                changeEvents([...events])
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <WeddingEventsContext.Provider value={allEvents}>
            <div className="event-root-container">
                { allEvents
                    ? allEvents.map(event => <EventCard key={event._id} event={event}/>)
                    : <h1>No Events present...</h1>
                }
            </div>
        </WeddingEventsContext.Provider>
    );
}