import { useState,useRef,useEffect } from 'react';
import styles from './home.module.css'
import rectangle2 from '../Images/Rectangle2.png'
import rectangle3 from '../Images/Rectangle3.png'
import rectangle4 from '../Images/Rectangle4.png'
import user from '../Images/user.png'
import { useNavigate } from 'react-router-dom'
import flag from '../Images/flag.png'
import people from '../Images/people.png'
import rupees from '../Images/Rupees.png'
import searchicon from '../Images/serachicon.png'
import arrow from '../Images/Group.png'
import {getJobs,getUserJobs} from '../services/job.js'

const home = ({setIsEditMode,setJobPropId,setJobView}) => {
  const menuContainerHomeRef = useRef();
  const menuHomeRef = useRef();
  const navigate = useNavigate();
  const [loggedIn,setLoggedIn] = useState(false);
  const [openMenu,setOpenMenu] = useState(false)
  const [selectedSkills,setSelectedSkills] = useState([]);
  const [jobTitle,setJobTitle] = useState('');
  const [fetchedJobs,setFetchedJobs] = useState([]);
  const [reload,setReload] = useState(0);
  const handleOpenMenu = ()=>{
      setOpenMenu(!openMenu);
  }
  function handleLogout(){
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('token')
    navigate('/')
    setLoggedIn(false)
  }
  function handleLogin(){
    navigate('/Login')
  }
  function handleRegister(){
    navigate('/Register')
  }
  function checkClickOutsidedropdownboard(e){
    if(openMenu && menuContainerHomeRef.current && !menuContainerHomeRef.current.contains(e.target) && menuHomeRef.current && !menuHomeRef.current.contains(e.target)){
        setOpenMenu(false);
    }
}
function handleClickSkill(skill) {
    if (!selectedSkills.includes(skill)){
        setSelectedSkills([...selectedSkills, skill]);
    }
}
function handleRemoveSkill(skill) {
    setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== skill));
} 
function handleClear(){
    setSelectedSkills([]);
    setJobTitle('')
    setReload(reload+1)
}
useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutsidedropdownboard)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutsidedropdownboard)
    }
},[openMenu])
const fetchJobs = async()=>{
  const jobs = await getJobs({selectedSkills,jobTitle})
  setFetchedJobs(jobs.data)
}
const handleAddJob = ()=>{
  navigate('/jobpost')
}
const handleJobTitle = (e)=>{
  setJobTitle(e.target.value)
}
const fetchUserJobs = async()=>{
  const user = localStorage.getItem('email')
  const userJobs = await getUserJobs({selectedSkills,jobTitle,user})
  setFetchedJobs(userJobs.data)
}
const handleApplyFilter = ()=>{
  if(loggedIn){
    fetchUserJobs();
  }
  else{
    fetchJobs();
  }
}
const handleEditJob = (jobId)=>{
  setIsEditMode(true);
  setJobPropId(jobId);
  navigate(`/jobPost?jobId=${jobId}`)
}
const handleViewDetails = (jobId)=>{
  setJobView(jobId);
  navigate(`/Job?id=${jobId}`);
}
useEffect(()=>{
  let loggedIntemp = false;
  if(localStorage.getItem('email')){
    loggedIntemp = true;
    setLoggedIn(true);
  }
  if(loggedIntemp){
    fetchUserJobs();
  }
  else{
    fetchJobs();
  }
},[loggedIn,reload])
  const skills = ['Java','Python','JavaScript','React JS','Node JS','Mongo DB','Express JS','HTML','CSS','C/C++']
  return (
    <>
    <div className={styles.header}>
        <img src={rectangle2} className={styles.headerrectangle2}></img>
        <img src={rectangle3} className={styles.headerrectangle3}></img>
        <img src={rectangle4} className={styles.headerrectangle4}></img>
        <p className={styles.headerText}>Jobfinder</p>
        {!loggedIn && <button className={styles.headerLogin} onClick={handleLogin}>Login</button>}
        {!loggedIn && <button className={styles.headerRegister} onClick={handleRegister}>Register</button>}
        {loggedIn && <p className={styles.headerlogout} onClick={handleLogout}>Logout</p>}
        {loggedIn && <p className={styles.headerhello}>Hello! Recruiter</p>}
        {loggedIn && <img src={user} className={styles.headeruser}></img>}
    </div>
    <div className={styles.searchDiv}>
        <div className={styles.searchBar}>
          <img src={searchicon} className={styles.searchBarImg}></img>
          <input className={styles.searchBarInput} placeholder='Type any job title' value={jobTitle} onChange={handleJobTitle}></input>
        </div>
        {loggedIn ? <div className={styles.addjobButtonDiv}>
          <button className={styles.addjobButton} onClick={handleAddJob}>+ Add Job</button>
        </div> : <div className={styles.addjobButtonDivNoShow}>
        </div>}
        <div className={styles.filterDiv}>
          <div className={styles.filterDivDropdown}>
            <div className={styles.filterDivSkilldiv} onClick={handleOpenMenu} ref={menuHomeRef}>
                <p className={styles.filterDivtext}>Skills</p>
                <img src={arrow}></img>
            </div>
            {openMenu && <div className={styles.filterDivDropdownDiv} ref={menuContainerHomeRef}>
                {skills.filter(skill => !selectedSkills.includes(skill)).map((skill,idx)=>{
                    return(
                        <p className={styles.filterDivDropdownOptions} key={idx} value={skill} onClick={()=>handleClickSkill(skill)}>{skill}</p >
                    )
                })}
            </div>}
          </div>
          <div className={styles.filterDivSelectedSkills}>
              {selectedSkills.map((skill,idx)=>{
                  return(<div key={idx} className={styles.filterDivSkills}>
                      <p className={styles.filterDivSkillText}>{skill}</p>
                      <p className={styles.filterDivCross}onClick={()=>handleRemoveSkill(skill)}>X</p>
                  </div>)
              })}
          </div>
          <button className={styles.filterDivApplyButton} onClick={handleApplyFilter}>Apply Filter</button>
          <p className={styles.filterDivClear} onClick={handleClear}>Clear</p>
        </div>
    </div>
    <div className={styles.jobsDiv}>
      {fetchedJobs.map((job,idx)=>{
        return(
        <div key={idx} className={styles.jobDiv}>
          <div className={styles.jobsDivLogo}>
            <img src={job.logoUrl}></img>
          </div>
          <div className={styles.jobsDivTitle}>
            <div className={styles.jobsDivTitleText}>
              <p>{job.jobPosition}</p>
            </div>
            <div className={styles.jobsDivTitleValues}>
              <span className={styles.jobsDivTitleValuesPeople}>
                <img src={people} className={styles.jobsDivTitleValuesPeopleImg} />
                <p className={styles.jobsDivTitleValuesPeopleText}>11-50</p>
              </span>
              <span className={styles.jobsDivTitleValuesRupees}>
                <img src={rupees} className={styles.jobsDivTitleValuesRupeesImg} />
                <p className={styles.jobsDivTitleValuesRupeesText}>{job.monthlySalary}</p>
              </span>
              <span className={styles.jobsDivTitleValuesFlag}>
                <img src={flag} className={styles.jobsDivTitleValuesFlagImg} />
                <p className={styles.jobsDivTitleValuesFlagText}>{job.location}</p>
              </span>
            </div>
            <div className={styles.jobsDivTitleChoices}>
              <p>{job.remote}</p>
              <p>{job.jobType}</p>
            </div>
          </div>
          <div className={styles.jobsDivSkills}>
            <div className={styles.jobsDivSkillsValues}>
              {job.skills.map((skill)=>{
                return(
                <div className={styles.jobsDivSkillValue}>
                  {skill}
                </div>
              )})}
            </div>
            <div className={styles.jobsDivSkillsButton}>
              {loggedIn && <button className={styles.jobsDivSkillsButtonEdit} onClick={()=>handleEditJob(job._id)}>Edit Job</button>}
              <button className={styles.jobsDivSkillsButtonView} onClick={()=>handleViewDetails(job._id)}>View Details</button>
            </div>
          </div>
        </div>
      )})}
    </div>
    <div className={styles.footer}>

    </div>
    </>
  )
}

export default home;