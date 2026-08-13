import { useState } from 'react'
import Login from './pages/login/Login'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import AddVehicle from './pages/AddVehicle/AddVehicle'
import AllVehicles from './pages/AllVehicles/AllVehicles'
import Profile from './pages/Profile/Profile'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/add-vehicle' element={<AddVehicle/>}/>
        <Route path='my-vehicles' element={<AllVehicles/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
