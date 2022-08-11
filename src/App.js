import { BrowserRouter} from 'react-router-dom'
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';
import './styles/App.css'
import React from 'react';
import { allEvents } from './eventData';

export const WeddingEventsContext = React.createContext()

export function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <WeddingEventsContext.Provider value={allEvents}>
                <Main/>
            </WeddingEventsContext.Provider>
        </BrowserRouter>
    );
}