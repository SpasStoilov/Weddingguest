import { Link } from "react-router-dom";

export function LogIn() {
    return (
        <div className="login-form-conteiner">
            <form className="login-form">
                <input type="text" placeholder="email"/>
                <input type="pasword" placeholder="pasword"/>
                <input type="submit" value="LogIn"/>
                <span>If don't have account <Link to="/register">Register</Link></span>
            </form>
        </div>
    );
}