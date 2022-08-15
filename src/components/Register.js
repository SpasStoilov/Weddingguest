import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FormEffect } from '../FormEffect'

const path = 'register'

export function Register() {

    useEffect(() => {
        let [cleaner, data] = FormEffect(".register-form", 'POST', path)
        console.log(data)
        return cleaner
    })

    return (
        <div className="register-form-conteiner">
            <form className="register-form">
                <input type="text" name="email" placeholder="email"/>
                <input type="password" name="password" placeholder="password"/>
                <input type="password" name="repeatPassword" placeholder="repeat password"/>
                <button>Register</button>
                <span>If you have account <Link to="/login">LogIn</Link></span>
            </form>
        </div>
    );
}