import { Link } from "react-router-dom"

export function Guests(){

    const eventId = 'testID'

    function onDelete(e, eventId) {
        e.preventDefault();
        console.log('Delete event: ', eventId);
    }

    function onAdd(e) {
        e.preventDefault();
        console.log('Add is cliked!');
    }

    return (
        <form className="event-detail-form-FoodDrinks">

            Guest here

            <div className="event-detail-body-actions">

                {/* Guest */}
                <Link className="event-detail-body-actions-send" to='/guests/vote/guestId'>Send</Link>

                {/* Logged */}
                <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                <Link className="event-detail-body-actions-save" to='/events/save/eventId'>Save</Link>
                <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>

            </div>

        </form>
    )
}