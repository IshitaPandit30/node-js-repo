import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login';
import { Register } from './Register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
           <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
