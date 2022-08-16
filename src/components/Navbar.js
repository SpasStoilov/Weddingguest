import { Link } from 'react-router-dom'
// import '../styles/App.css'

export function Navbar() {

    function deleteLocalsAndCookies (){
        localStorage.clear()
    }

    return (
        <nav> 

            { !localStorage.getItem('user')      
                ?
                    <div className="Guest">
                        <Link to='/register'>Register</Link>
                        <Link to='/login'>LogIn</Link>
                    </div>

                :
                    <div className="Logged">
                        <Link to='/myevents'>My Events</Link>
                        <Link to='/createevents'>Create Events</Link>
                        <a href='/login' onClick={deleteLocalsAndCookies}>LogOut</a>
                    </div>
            }

        </nav>
    );
}