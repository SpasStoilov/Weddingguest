import { Link } from "react-router-dom";

export function MyEvents() {

    // here we must fetch all Events and atouch eventId to Link's at '/xxxx'

    return (
        <div className="event-root-container">

            <div className="event-conteiner">
                <img className="event-img" src="https://www.magenboys.com/images/photo_galleries/gallery/large_1382114157.jpg" alt="Event IMG"/>
                <h3 className="event-title">My Wedding Title-HERE</h3>
                <Link className="event-detail-button-link" to="event/details/fooddrinks/xxxx">DETAILS</Link>
            </div>

            <div className="event-conteiner">
                <img className="event-img" src="https://www.magenboys.com/images/photo_galleries/gallery/large_1382114157.jpg" alt="Event IMG"/>
                <h3 className="event-title">My Wedding Title-HERE</h3>
                <Link className="event-detail-button-link" to="event/details/fooddrinks/xxxx">DETAILS</Link>
            </div>
            
            <div className="event-conteiner">
                <img className="event-img" src="https://www.magenboys.com/images/photo_galleries/gallery/large_1382114157.jpg" alt="Event IMG"/>
                <h3 className="event-title">My Wedding Title-HERE</h3>
                <Link className="event-detail-button-link" to="event/details/fooddrinks/xxxx">DETAILS</Link>
            </div>
        </div>
    );
}