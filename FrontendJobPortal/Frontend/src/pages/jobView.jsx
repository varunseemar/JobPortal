import { useState,useEffect } from 'react';
import styles from './jobView.module.css'
import rectangle2 from '../Images/Rectangle2.png'
import rectangle3 from '../Images/Rectangle3.png'
import rectangle4 from '../Images/Rectangle4.png'
import user from '../Images/user.png'
import { useNavigate } from 'react-router-dom'
import {getViewJob} from '../services/job'
import money from '../Images/money.png'
import duration from '../Images/duration.png'

const jobView = ({jobView,setJobView,setIsEditMode,setJobPropId}) => {
    const [loggedIn,setLoggedIn] = useState(false);
    const [jobData,setJobdata] = useState(null);
    const navigate = useNavigate();
    function handleLogin(){
        navigate('/Login')
    }
    const getQueryParams = (query) => {
        return new URLSearchParams(query);
    };
    function handleRegister(){
        navigate('/Register')
    }
    function handleLogout(){
        localStorage.removeItem('name')
        localStorage.removeItem('email')
        localStorage.removeItem('token')
        setLoggedIn(false)
    }
    const fetchViewJob = async(jobId)=>{
        const job = await getViewJob({jobId});
        setJobdata(job.data)
    }
    useEffect(()=>{
        if(localStorage.getItem('email')){
            setLoggedIn(true);
        }
        const queryParams = getQueryParams(location.search);
        const jobId = queryParams.get('id');
        if(jobId){
            fetchViewJob(jobId);
        }
        else{
            console.error('Job ID not found in URL');
            navigate('/');
        }
    },[location.search, navigate]);
    if(!jobData){
        return <p>Loading job details...</p>;
    }
    const handleEditJob = (jobId)=>{
        setIsEditMode(true);
        setJobPropId(jobId);
        navigate(`/jobPost?jobId=${jobId}`);
    }
  return (
    <div className={styles.jobViewFullPage}>
        <div className={styles.jobViewheader}>
            <img src={rectangle2} className={styles.jobViewheaderrectangle2}></img>
            <img src={rectangle3} className={styles.jobViewheaderrectangle3}></img>
            <img src={rectangle4} className={styles.jobViewheaderrectangle4}></img>
            <p className={styles.jobViewheaderText}>Jobfinder</p>
            {!loggedIn && <button className={styles.jobViewheaderLogin} onClick={handleLogin}>Login</button>}
            {!loggedIn && <button className={styles.jobViewheaderRegister} onClick={handleRegister}>Register</button>}
            {loggedIn && <p className={styles.jobViewheaderlogout} onClick={handleLogout}>Logout</p>}
            {loggedIn && <p className={styles.jobViewheaderhello}>Hello! Recruiter</p>}
            {loggedIn && <img src={user} className={styles.jobViewheaderuser}></img>}
        </div>
        <div className={styles.jobViewHeading}>
            <p className={styles.jobViewHeadingText}>{`${jobData.jobPosition} Work From ${jobData.remote} at ${jobData.companyName}`}</p>
        </div>
        <div className={styles.jobViewJobInfo}>
            <div className={styles.jobViewJobInfoDiv1}>
                <p>1w ago .</p>
                <p>{jobData.jobType}</p>
                <img src={jobData.logoUrl}></img><span><p>{jobData.companyName}</p></span>
            </div>
            <div className={styles.jobViewJobInfoDiv2}>
                <p>{jobData.jobPosition}</p>
                {loggedIn && <button onClick={()=>handleEditJob(jobData._id)}>Edit Job</button>}
            </div>
            <div className={styles.jobViewJobInfoDiv3}>
                <p>{`${jobData.location} | India`}</p>
            </div>
            <div className={styles.jobViewJobInfoDiv4}>
                <div>
                    <p className={styles.jobViewJobInfoDiv4ImageText}><img src={money}></img>Salary</p>
                    <p>{`${jobData.monthlySalary}/month`}</p>
                </div>
                <div>
                    <p className={styles.jobViewJobInfoDiv4ImageText}><img className={styles.jobViewJobInfoDiv4Image} src={duration}></img>Duration</p>
                    <p>{jobData.jobType}</p>
                </div>
            </div>
            <div className={styles.jobViewJobInfoDiv5}>
                <p className={styles.jobViewJobInfoDivHeading}>About Company</p>
                <p className={styles.jobViewJobInfoDivText}>{jobData.aboutCompany}</p>
            </div>
            <div className={styles.jobViewJobInfoDiv6}>
                <p className={styles.jobViewJobInfoDivHeading}>About Job</p>
                <p className={styles.jobViewJobInfoDivText}>{jobData.jobDescription}</p>
            </div>
            <div className={styles.jobViewJobInfoDiv7}>
                <p className={styles.jobViewJobInfoDivHeading}>Skill(s) required</p>
                <div className={styles.jobViewJobInfoDiv7Skills}>
                {jobData.skills.map((skill)=>{
                    return(
                    <p className={styles.jobViewJobInfoDiv7Skill}>{skill}</p>
                    )
                })}
                </div>
            </div>
            <div className={styles.jobViewJobInfoDiv8}>
                <p className={styles.jobViewJobInfoDivHeading}>Additional Information</p>
                <p className={styles.jobViewJobInfoDivText}>{jobData.information}</p>
            </div>
        </div>
        <div className={styles.jobViewfooter}>

        </div>
    </div>
  )
}

export default jobView;