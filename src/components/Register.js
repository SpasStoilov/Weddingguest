import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchME } from "../fetchMe"
import { DataForm } from "../getFormData"

const path = '/register'

export function Register() {

    let [emailValue, changeEmail] = useState(['*', 'black'])
    let [passwordValue, changePassword] = useState(['*', 'black'])
    let [repeatValue, changeRepeat] = useState(['*', 'black'])
    let navigate = useNavigate()

    let correct = {
        email: changeEmail,
        password: changePassword,
        repeatPassword: changeRepeat
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
            else if (response.status === 302){
                navigate('/login')
            }
            else {
                let user = await response.json()
                localStorage.setItem('user', user.accessToken)
                // document.cookie = `user=${user.accessToken}; HttpOnly`
                window.location.replace('/createevents')
            }
        }
        catch (err){
            console.log(err.message)
        }
        
    }

    return (
        <div className="register-form-conteiner">
            <form className="register-form" onSubmit={OnSub}>
                <label htmlFor="email" style={{color: emailValue[1]}}>{emailValue[0]}</label>
                <input type="text" name="email" placeholder="email"/>
                <label htmlFor="password" style={{color: passwordValue[1]}}>{passwordValue[0]}</label>
                <input type="password" name="password" placeholder="password"/>
                <label htmlFor="repeatPassword" style={{color: repeatValue[1]}}>{repeatValue[0]}</label>
                <input type="password" name="repeatPassword" placeholder="repeat password"/>
                <button>Register</button>
                <span>If you have account <Link to="/login">LogIn</Link></span>
            </form>
        </div>
    );
}