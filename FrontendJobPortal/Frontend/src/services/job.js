import axios from 'axios'
import { BACKEND_URL } from '../utils/constant'

export const postJob = async ({jobInfo,token})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/d1/job/jobpost`,{
            jobInfo,
        },{
            headers:{
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const getJobs = async ({selectedSkills,jobTitle})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/d1/job/fetchjobs`,{
            params: {selectedSkills,jobTitle}
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const getUserJobs = async ({selectedSkills,jobTitle,user})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/d1/job/fetchuserjobs`,{
            params: {selectedSkills,jobTitle,user}
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const fetchEditJob = async ({jobPropId,jobUpdaterId})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/d1/job/jobpost/${jobPropId}`,{
            headers:{
                'Content-Type': 'application/json'
            },
            params:{ 
                jobUpdaterId 
            },
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const updateJob = async ({jobInfo,token,jobPropId,jobUpdaterId})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/d1/job/jobpost/${jobPropId}`,{
            jobInfo,
            jobUpdaterId,
        },{
            headers:{
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const getViewJob = async ({jobId})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/d1/job/jobview/${jobId}`);
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}