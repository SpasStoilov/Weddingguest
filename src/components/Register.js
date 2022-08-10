import { Link } from "react-router-dom";

export function Register() {
    return (
        <div className="register-form-conteiner">
            <form className="register-form">
                <input type="text" placeholder="email"/>
                <input type="pasword" placeholder="pasword"/>
                <input type="repPasword" placeholder="repeat pasword"/>
                <input type="submit" value="Register"/>
                <span>If you have account <Link to="/login">LogIn</Link></span>
            </form>
        </div>
    );
}