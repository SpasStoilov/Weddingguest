import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"

export function FoodDrinks(){

    let eventID = useParams().eventId

    function onDelete(e) {
        e.preventDefault();
        console.log('Delete event: ', eventID);
        
    }

    function onAdd(e) {
        e.preventDefault();
        console.log('Add is cliked!');
        let h1 = document.createElement('h1')
        h1.textContent = 'HYYYY'
        e.target.parentElement.parentElement.prepend(h1)
    }

    let Li = [1, 2, 3]

    return (

        <form className="event-detail-form-FoodDrinks">


            { 
                Li.map(e => <h1>{e}</h1>)
            }

            <h2>Salads</h2>
            <div className="event-detail-body-Salads">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <h2>Appetizers</h2>
            <div className="event-detail-body-Appetizers">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <h2>MainMeals</h2>
            <div className="event-detail-body-MainMeals">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>
            
            <h2>Deserts</h2>
            <div className="event-detail-body-Deserts">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <h2>Alcoholic Drinks</h2>
            <div className="event-detail-body-Alcohol">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <h2>Soft Drinks</h2>
            <div className="event-detail-body-Soft">

                <div>
                    <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>
                    <button className="event-detail-body-actions-add" onClick={onAdd}>Add</button>
                </div>
            </div>

            <div className="event-detail-body-actions">

                {/* Guest */}
                <Link className="event-detail-body-actions-send" to='/guests/vote/guestId'>Send</Link>

                {/* Logged */}
                <Link className="event-detail-body-actions-save" to='/events/save/eventId'>Save</Link>
                <button className="event-detail-body-actions-delete" onClick={onDelete}>Delete</button>

            </div>

        </form>
    )
}