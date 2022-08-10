import { BrowserRouter} from 'react-router-dom'
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';
import './styles/App.css'

export function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Main/>
        </BrowserRouter>
    );
}