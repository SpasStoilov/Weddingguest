import { Link } from "react-router-dom";

export function MyEvents() {
    return (
        <div className="event-conteiner">
            <Link to="post/details/{id}">DETAILS</Link>
        </div>
    );
}