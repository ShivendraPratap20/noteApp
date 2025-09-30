import SignUp from './components/user/signup';
import Login from './components/user/Login';
import Dashboard from './components/Dashboard/Dashboard';
import './index.css';
import { Route, Routes } from 'react-router-dom'

function App() {
  return(<>
    <Routes>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/' element={<Login/>}/> 
      <Route path='/signup' element={<SignUp/>}/>
    </Routes>
  </>)
}

export default App
