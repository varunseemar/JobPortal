import React from 'react'
import styles from './login.module.css'
import { useState } from 'react';
import registerpic from '../Images/register.png'
import { loginUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [userData,setUserData] = useState({
        email:'',
        password:'',
    })
    const handleChange = (e)=>{
        setUserData({
            ...userData,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(userData.email === '' || userData.password === '' ){
            return;
        }
        try{
            const {email,password} = userData;
            const response = await loginUser({email,password})
            if(response.status === 200){
                const {data} = response;
                localStorage.setItem('email', email)
                localStorage.setItem('name', data.name)
                localStorage.setItem('token', data.token)
                navigate('/')
            }
        }
        catch(err){
            console.log(err.message)
        }
    }
  return (
    <div className={styles.register}>
        <div className={styles.form}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"0px",fontSize:"30px"}}>Already have an account?</p>
            <p style={{fontFamily:"sans-serif",marginTop:"15px",marginBottom:"30px"}}>Your personal job finder is here</p>
            <form onSubmit={handleSubmit}>
                <input name='email' value={userData.email} onChange={handleChange} type='email' placeholder='Email'></input>
                <input name='password' value={userData.password} onChange={handleChange} type='password' placeholder='Password' style={{marginBottom:"0vh"}}></input>
                <button type='submit'>Sign In</button>
            </form>
            <p style={{fontFamily:"sans-serif",marginTop:"25px",marginLeft:"5px"}}>Don’t have an account?&nbsp;&nbsp;<a href='/Register' style={{color:"black",fontWeight:"600"}}>Sign Up</a></p>
        </div>
        <div className={styles.pic}>
            <p className={styles.pictext}>Your Personal Job Finder</p>
            <img src={registerpic}></img>
        </div>
    </div>
  )
}

export default Login;