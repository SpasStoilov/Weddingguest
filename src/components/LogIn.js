import { Link} from "react-router-dom";
import { useState } from "react";
import { fetchME } from "../fetchMe"
import { DataForm } from "../getFormData"


const path = '/login'

export function LogIn() {
    
    let [emailValue, changeEmail] = useState(['*', 'black'])
    let [passwordValue, changePassword] = useState(['*', 'black'])

    let correct = {
        email: changeEmail,
        password: changePassword,
    }

    async function OnSub(e){
        e.preventDefault();
        let payload = DataForm(e.currentTarget)
        console.log(payload)

        try{
            let response = await fetchME("POST", path, payload)

            if (response.status === 406){
                let result = await response.json()
                for (let obj of result){
                    correct[obj.param]([obj.msg, 'red'])
                }
            }
            else {
                let user = await response.json()
                localStorage.setItem('user', user.accessToken)
                window.location.replace('/myevents')
            }
        }
        catch (err){
            //console.log(err.message)
            window.location.replace('/register')
        }
        
    }

    return (
        <div className="login-form-conteiner">
            <form className="login-form" onSubmit={OnSub}>
                <label htmlFor="email" style={{color: emailValue[1]}}>{emailValue[0]}</label>
                <input type="text" name="email" placeholder="email"/>
                <label htmlFor="password" style={{color: passwordValue[1]}}>{passwordValue[0]}</label>
                <input type="password" name="password" placeholder="password"/>
                <button>LogIn</button>
                <span>If don't have account <Link to="/register">Register</Link></span>
            </form>
        </div>
    );
}