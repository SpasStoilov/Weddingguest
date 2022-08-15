import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FormEffect } from '../FormEffect'

const path = 'login'

export function LogIn() {
    
    useEffect(() => {
        let [cleaner, data] = FormEffect(".login-form", 'POST', path)
        console.log(data)
        return cleaner
    })

    return (
        <div className="login-form-conteiner">
            <form className="login-form">
                <input type="text" name="email" placeholder="email"/>
                <input type="password" name="password" placeholder="password"/>
                <button>LogIn</button>
                <span>If don't have account <Link to="/register">Register</Link></span>
            </form>
        </div>
    );
}