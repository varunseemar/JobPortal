import axios from 'axios'
import { BACKEND_URL } from '../utils/constant'

export const registerUser = async ({name,email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/d1/auth/Register`,{
            name,
            email,
            password
        },{ 
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}
export const loginUser = async ({email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/d1/auth/Login`,{
            email,
            password
        },{ 
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data.message)
    }
}