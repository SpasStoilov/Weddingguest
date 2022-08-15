import { Link } from "react-router-dom";
// import { useEffect } from "react";
// import { FormEffect } from '../FormEffect'
import { fetchME } from "../fetchMe"

const path = 'register'

export function Register() {

    // useEffect(() => {

    //     let [cleaner, response] = FormEffect(".register-form", 'POST', path)
        
    //     async function Response(){
    //         let result = await response.json()
    //         console.log(result)
    //     }
    //     Response()
    //     return cleaner
    // })

    async function OnSub(e){
        e.preventDefault();
        let formData = new FormData(e.currentTarget)
        console.log('FormData: ', Object.fromEntries(formData.entries()))
    
        let payload = Object.fromEntries(formData.entries())
    
        let result = await fetchME("POST", path, payload)
        console.log(result)
    }

    return (
        <div className="register-form-conteiner">
            <form className="register-form" onSubmit={OnSub}>
                <input type="text" name="email" placeholder="email"/>
                <input type="password" name="password" placeholder="password"/>
                <input type="password" name="repeatPassword" placeholder="repeat password"/>
                <button>Register</button>
                <span>If you have account <Link to="/login">LogIn</Link></span>
            </form>
        </div>
    );
}