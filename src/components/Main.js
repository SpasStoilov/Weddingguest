import { Routes, Route } from 'react-router-dom'

import { MyEvents } from "./MyEvents";
import { CreateEvents } from "./CreateEvents";
import { LogOut } from './LogOut'
import { Register } from './Register';
import { LogIn } from './LogIn';
import { EventDetails } from './EventDetails';
import { FoodDrinks } from './FoodDrinks';
import { Locations } from './Locations';
import { GuestsHints } from './GuestsHints';
import { Guests } from './Guests';

export function Main() {
    return (
        <main>
            <Routes>
                <Route path='/myevents' element={<MyEvents/>}/>
                <Route path='/createevents' element={<CreateEvents/>}/>
                <Route path='/logout' element={<LogOut/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<LogIn/>}/>

                <Route path='/myevents/event/details/' element={<EventDetails/>}>

                    <Route path='fooddrinks/:eventId' element={<FoodDrinks/>}/>
                    <Route path='locations/:eventId' element={<Locations/>}/>
                    <Route path='guest/hints/:eventId' element={<GuestsHints/>}/>
                    <Route path='guest/:eventId' element={<Guests/>}/>

                </Route>

            </Routes>
        </main>
    );
}