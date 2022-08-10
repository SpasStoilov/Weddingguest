import { Routes, Route } from 'react-router-dom'

import { MyEvents } from "./MyEvents";
import { CreateEvents } from "./CreateEvents";
import { LogOut } from './LogOut'
import { Register } from './Register';
import { LogIn } from './LogIn';

export function Main() {
    return (
        <main>
            <Routes>
                <Route path='/myevents' element={<MyEvents/>}/>
                <Route path='/createevents' element={<CreateEvents/>}/>
                <Route path='/logout' element={<LogOut/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<LogIn/>}/>
            </Routes>
        </main>
    );
}