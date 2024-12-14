import React from 'react';
import styles from './jobPost.module.css';
import jobpic from '../Images/jobpost.png';
import arrow from '../Images/Group.png'
import { useState,useRef,useEffect } from 'react';
import { useNavigate,useLocation} from 'react-router-dom'
import {postJob,updateJob} from '../services/job.js'
import toast from 'react-hot-toast'
import PageNotFound from '../pages/PageNotFound.jsx'
import { fetchEditJob } from '../services/job.js';

const JobPost = ({setIsEditMode,isEditMode,jobPropId,setJobPropId}) => {
    const menuContainerRef = useRef();
    const menuRef = useRef();
    const navigate = useNavigate();
    const [selectedSkills,setSelectedSkills] = useState([]);
    const [loading,setLoading] = useState(false);
    const [loggedIn,setLoggedIn] = useState(false);
    const query = useQuery();
    const jobIdFromQuery = query.get('jobId');
    const [jobInfo,setJobInfo] = useState({
        companyName:'',
        logoUrl:'',
        jobPosition:'',
        monthlySalary:null,
        jobType:'',
        remote:'',
        location:'',
        jobDescription:'',
        aboutCompany:'',
        skills:[],
        information:'',
        creator:'',
    })
    const [Errors,setErrors] = useState({
        companyName:'',
        logoUrl:'',
        jobPosition:'',
        monthlySalary:'',
        jobType:'',
        remote:'',
        location:'',
        jobDescription:'',
        aboutCompany:'',
        skills:'',
        information:'',
    });
    const [openMenu,setOpenMenu] = useState(false)
    const handleOpenMenu = ()=>{
        setOpenMenu(!openMenu);
    }
    function useQuery(){
        return new URLSearchParams(useLocation().search);
    }
    const handleChange = (e)=>{
            setJobInfo({
                ...jobInfo,
                [e.target.name] : e.target.value
            })
    }
    const fetchJobEdit = async()=>{
        let jobUpdaterId = localStorage.getItem('email')
        const response = await fetchEditJob({jobPropId:jobIdFromQuery,jobUpdaterId})
        setJobInfo(response.data)
        setSelectedSkills(response.data.skills)
    }
    useEffect(()=>{
        if(jobIdFromQuery){
            setJobPropId(jobIdFromQuery); 
            fetchJobEdit();
        }
    },[jobIdFromQuery])
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        let errors = {};
        if(!jobInfo.companyName || jobInfo.companyName.trim() === ""){
            errors.companyName = "companyName is Required"
        }
        if(!jobInfo.logoUrl || jobInfo.logoUrl.trim() === ""){
            errors.logoUrl = "logoUrl is Required"
        }
        if(!jobInfo.jobPosition || jobInfo.jobPosition.trim() === ""){
            errors.jobPosition = "jobPosition is Required"
        }
        if(!jobInfo.monthlySalary || jobInfo.monthlySalary.trim() === ""){
            errors.monthlySalary = "monthlySalary is Required"
        }
        if(!jobInfo.jobType || jobInfo.jobType.trim() === ""){
            errors.jobType = "jobType is Required"
        }
        if(!jobInfo.remote || jobInfo.remote.trim() === ""){
            errors.remote = "remote is Required"
        }
        if(!jobInfo.location || jobInfo.location.trim() === ""){
            errors.location = "location is Required"
        }
        if(!jobInfo.jobDescription || jobInfo.jobDescription.trim() === ""){
            errors.jobDescription = "jobDescription is Required"
        }
        if(!jobInfo.aboutCompany || jobInfo.aboutCompany.trim() === ""){
            errors.aboutCompany = "aboutCompany is Required"
        }
        if(!jobInfo.information || jobInfo.information.trim() === ""){
            errors.information = "information is Required"
        }
        if(selectedSkills.length ===0 ){
            errors.skills = "skills is Required"
        }
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            setLoading(false);
            toast.error('Please fill all the * Deatils')
            return;
        }
        let currentCreator = localStorage.getItem('email');
        const updatedJobData = {...jobInfo, creator: currentCreator, skills: selectedSkills};

        try{
            if(localStorage.getItem('token') && localStorage.getItem('email') && selectedSkills.length !== 0){
                let token = localStorage.getItem('token')
                let jobUpdaterId = localStorage.getItem('email')
                if(isEditMode){
                    const response = await updateJob({jobInfo: updatedJobData,token,jobPropId,jobUpdaterId})
                    if(response.status === 200){
                        toast.success('Job Updated Successfully')
                        navigate('/')
                    }
                }
                else{
                    const response = await postJob({jobInfo: updatedJobData,token})
                    if(response.status === 200){
                        toast.success('Job Posted Successfully')
                        navigate('/')
                    }
                }
            }
            else{
                setLoading(false);
                toast.error('Something Went Wrong')
                return;
            }
        }
        catch(err){
            console.log(err.message)
        }
        finally{
            setLoading(false);
            setIsEditMode(false);
            setJobPropId(null);
        }
    }
    function checkClickOutsidedropdownboard(e){
        if(openMenu && menuContainerRef.current && !menuContainerRef.current.contains(e.target) && menuRef.current && !menuRef.current.contains(e.target)){
            setOpenMenu(false);
        }
    }
    function handleClickSkill(skill) {
        if(selectedSkills.length >= 4){
            toast.error('You can select up to 4 skills only!');
            return;
        }
        if(!selectedSkills.includes(skill)){
            setSelectedSkills([...selectedSkills, skill]);
        }
    }
    function handleCancel(){
        setIsEditMode(false);
        setJobPropId(null);
        navigate('/')
    }
    function handleRemoveSkill(skill) {
        setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== skill));
    } 
    useEffect(()=>{
        document.addEventListener('mousedown',checkClickOutsidedropdownboard)
        return()=>{
            document.removeEventListener('mousedown',checkClickOutsidedropdownboard)
        }
    },[openMenu])
    const skillsDefined = ['Java','Python','JavaScript','React JS','Node JS','Mongo DB','Express JS','HTML','CSS','C/C++']
    useEffect(()=>{
        if(localStorage.getItem('email')){
            setLoggedIn(true)
        }
    },[])
    if(!loggedIn){
        return <PageNotFound />;
    }
  return (
    <div className={styles.jobpost}>
        <div className={styles.jobform}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"0px",fontSize:"35px",marginTop:"25px"}}>Add job description</p>
            <form onSubmit={handleSubmit} className={styles.jobformMain}>
                <div className={styles.jobformCompanyName}>
                    <label htmlFor='Companyname'>Company Name{Errors.companyName && <p>*</p>}</label>
                    <input id='Companyname' name={'companyName'} placeholder='Enter your company name here' value={jobInfo.companyName} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformAddLogo}>
                    <label htmlFor='AddLogo'>Add logo URL{Errors.logoUrl && <p>*</p>}</label>
                    <input id='AddLogo' placeholder='Enter the link' name={'logoUrl'} value={jobInfo.logoUrl} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformJobPosition}>
                    <label htmlFor='JobPosition'>Job position{Errors.jobPosition && <p>*</p>}</label>
                    <input id='JobPosition' placeholder='Enter job position' name={'jobPosition'} value={jobInfo.jobPosition} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformMonthlySalary}>
                    <label htmlFor='MonthlySalary'>Monthly salary{Errors.monthlySalary && <p>*</p>}</label>
                    <input id='MonthlySalary' placeholder='Enter Amount in rupees' name={'monthlySalary'} value={jobInfo.monthlySalary} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformJobType}>
                    <label htmlFor='JobType'>Job Type{Errors.jobType && <p>*</p>}</label>
                    <select className={styles.jobformJobTypeSelect} name={'jobType'} value={jobInfo.jobType} onChange={handleChange}>
                        <option value={""}>Select</option>
                        <option value={"Full-time"}>Full-time</option>
                        <option value={"Part-time"}>Part-time</option>
                        <option value={"Contract"}>Contract</option>
                        <option value={"Freelance"}>Freelance</option>
                    </select>
                </div>
                <div className={styles.jobformRemote}>
                    <label htmlFor='Remote'>Remote/office{Errors.remote && <p>*</p>}</label>
                    <select className={styles.jobformRemoteSelect} name={'remote'} value={jobInfo.remote} onChange={handleChange}>
                        <option value={""}>Select</option>
                        <option value={"Remote"}>Remote</option>
                        <option value={"Office"}>Office</option>
                    </select>
                </div>
                <div className={styles.jobformLocation}>
                    <label htmlFor='Location'>Location{Errors.location && <p>*</p>}</label>
                    <input id='Location' placeholder='Enter Location' name={'location'} value={jobInfo.location} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformJobDescription}>
                    <label htmlFor='JobDescription'>Job Description{Errors.jobDescription && <p>*</p>}</label>
                    <textarea className={styles.jobformJobDescriptionTextarea} name={'jobDescription'} value={jobInfo.jobDescription} onChange={handleChange} id='JobDescription' placeholder='Type the job description'></textarea>
                </div>
                <div className={styles.jobformAboutCompany}>
                    <label htmlFor='AboutCompany'>About Company{Errors.aboutCompany && <p>*</p>}</label>
                    <textarea className={styles.jobformAboutCompanyTextarea} id='AboutCompany' name={'aboutCompany'} value={jobInfo.aboutCompany} onChange={handleChange} placeholder='Type about your company'></textarea>
                </div>
                <div className={styles.jobformSkillsRequired}>
                    <label htmlFor='SkillsRequired'>Skills Required{Errors.skills && <p>*</p>}</label>
                    <div className={styles.jobformSkillsRequiredSelect} id='SkillsRequired' onClick={handleOpenMenu} ref={menuRef}>
                        <p className={styles.jobformSkillsRequiredSelectText}>Enter the must have skills </p>
                        <img src={arrow}></img>
                    </div>
                    {openMenu && <div className={styles.jobformSkillsRequiredSelectMenu} ref={menuContainerRef}>
                        {skillsDefined.filter(skill => !selectedSkills.includes(skill)).map((skill,idx)=>{
                            return(
                                <p className={styles.optionMenu} key={idx} value={skill} onClick={()=>handleClickSkill(skill)}>{skill}</p >
                            )
                        })}
                    </div>}
                </div>
                <div className={styles.jobformSkillsRequiredSelected}>
                    {selectedSkills.map((skill,idx)=>{
                        return(<div key={idx} className={styles.jobformSkillsRequiredSelectedSkill}>
                            <p className={styles.jobformSkillsRequiredSelectedSkillText}>{skill}</p>
                            <p className={styles.jobformSkillsRequiredSelectedSkillRemove}onClick={()=>handleRemoveSkill(skill)}>X</p>
                        </div>)
                    })}
                </div>
                <div className={styles.jobformInformation}>
                    <label htmlFor='Information'>Information{Errors.information && <p>*</p>}</label>
                    <input id='Information' placeholder='Enter the additional information' name={'information'} value={jobInfo.information} onChange={handleChange}></input>
                </div>
                <div className={styles.jobformButtons}>
                    <button className={styles.jobformCancelButton} onClick={handleCancel}>Cancel</button>
                    <button type='submit' className={styles.jobformAddButton} disabled={loading}>{isEditMode ? 'Update' : '+ Add Job'}</button>
                </div>
            </form>
        </div>
        <div className={styles.jobpic}>
            <p className={styles.jobpictext}>Recruiter add job details here</p>
            <img src={jobpic}></img>
        </div>
    </div>
  )
}

export default JobPost;