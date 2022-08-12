import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FormEffect } from '../FormEffect'

export function Register() {

    useEffect(() => {
        let [cleaner, data] = FormEffect(".register-form")
        console.log(data)
        return cleaner
    })

    return (
        <div className="register-form-conteiner">
            <form className="register-form">
                <input type="text" name="email" placeholder="email"/>
                <input type="password" name="password" placeholder="pasword"/>
                <input type="password" name="repeatPasword" placeholder="repeat pasword"/>
                <button>Register</button>
                <span>If you have account <Link to="/login">LogIn</Link></span>
            </form>
        </div>
    );
}