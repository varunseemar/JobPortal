import './App.css'
import Home from './pages/home'
import Register from './pages/register'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import JobPost from './pages/jobPost'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import JobView from './pages/jobView'

function App() {
  const [isEditMode,setIsEditMode] = useState(false);
  const [jobPropId,setJobPropId] = useState(null);
  const [jobView,setJobView] = useState(null);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home setIsEditMode={setIsEditMode} setJobPropId={setJobPropId} setJobView={setJobView}/>}></Route>
        <Route path='/Register' element={<Register />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/Jobpost' element={<JobPost setIsEditMode={setIsEditMode} isEditMode={isEditMode} jobPropId={jobPropId} setJobPropId={setJobPropId}/>}></Route>
        <Route path='/Job' element={<div className='jobViewComponent'><JobView jobView={jobView} setJobView={setJobView} setIsEditMode={setIsEditMode} setJobPropId={setJobPropId}/></div>}></Route>
      </Routes>
    </>
  )
}

export default App
