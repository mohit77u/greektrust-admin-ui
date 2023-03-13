import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/css/style.scss';
import Home from './pages/Home';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                </Routes>
            </BrowserRouter>
        
        </div>
    );
}

export default App;
