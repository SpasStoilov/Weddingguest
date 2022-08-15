import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
export function LogOut() {

    useEffect(() => {
        
        console.log('dfsdfsfsdfsdfsdf', document.cookie)
        localStorage.clear()
        // this part must delete session at server and at register:
        document.cookie = ''
    })

    return (
        <Navigate replace to="/register"/>
    )
}