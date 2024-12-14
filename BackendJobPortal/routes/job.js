const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const jobSchema = require('../schemas/job.schema')
const authUserlogin = require('../middleware/authLogin')

router.post('/jobpost',authUserlogin, async (req,res,next)=>{
   try {
    const jobInfo = req.body.jobInfo;
    const companyName=jobInfo.companyName;
    const logoUrl=jobInfo.logoUrl;
    const jobPosition=jobInfo.jobPosition;
    const monthlySalary=jobInfo.monthlySalary;
    const jobType=jobInfo.jobType;
    const remote=jobInfo.remote;
    const location=jobInfo.location;
    const jobDescription=jobInfo.jobDescription;
    const aboutCompany=jobInfo.aboutCompany;
    const skills=jobInfo.skills;
    const information=jobInfo.information;
    const creator=jobInfo.creator;
    const jobDetails = {
        companyName,
        logoUrl,
        jobPosition,
        monthlySalary,
        jobType,
        remote,
        location,
        jobDescription,
        aboutCompany,
        skills,
        information,
        creator,
    }
    const job = new jobSchema(jobDetails);
    job.save().then(()=>{
        res.json(jobInfo).status(200);
    })
    .catch((e)=>{
        next(e.message)
    })
    }
    catch(e){
        throw new Error(e.message);
    }
})

router.get('/fetchjobs',async (req,res,next)=>{
    try{
        const {selectedSkills,jobTitle} = req.query;
        const query = {};
        const skills = Array.isArray(selectedSkills) ? selectedSkills : [];
        if(jobTitle){
            query.jobPosition = { $regex: jobTitle, $options: 'i' };
        }
        if(skills.length > 0){
            query.skills = { $in: skills };
        }
        const job = await jobSchema.find(query);
        if(job){
             res.status(200).json(job);
        }
        else{
             res.status(404).send("Job Not Found")
        }
    }
    catch(e){
        next(e);
    }
    
})
router.get('/fetchuserjobs',async (req,res,next)=>{
    try{
        const {selectedSkills,jobTitle,user} = req.query;
        if(!user){
            return res.status(400).send("User (creator) is required to fetch jobs.");
        }
        const query = {creator:user};
        const skills = Array.isArray(selectedSkills) ? selectedSkills : [];
        if(jobTitle){
            query.jobPosition = { $regex: jobTitle, $options: 'i' };
        }
        if(skills.length > 0){
            query.skills = { $in: skills };
        }
        const job = await jobSchema.find(query);
        if(job){
             res.status(200).json(job);
        }
        else{
             res.status(404).send("Job Not Found")
        }
    }
    catch(e){
        next(e);
    }
    
})

router.delete('/:id',async (req,res,next)=>{
    try{
        const id = req.params.id;
        const job = await jobSchema.findById(id);
        if(!job){
            return res.status(404).send("Job not found");
        }
        const jobCreatorId = job.userId.toString();
        const jobDeletorId = req.user._id.toString();
        if(jobCreatorId !== jobDeletorId){
            res.status(406).send("Not authorized")
        }
        await jobSchema.findByIdAndDelete(id);
        res.status(200).send("Job deleted Successfully");
    }
    catch(e){
        next(e);
    }

})

router.post("/jobpost/:id",authUserlogin, async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {jobUpdaterId,jobInfo} = req.body;
        const job = await jobSchema.findById(id);
        if(!job){
            return res.status(404).send("Job not Found")
        }
        if(job){
            const jobCreatorId = job.creator;
            if(jobCreatorId !== jobUpdaterId){
                return res.status(407).send("You are not authorized to update this Job")
            }
            const updatedJob = await jobSchema.findByIdAndUpdate(id,jobInfo);
            res.status(200).send(updatedJob);
        }
    }
    catch(e){
        next(e);
    }
    
})

router.get("/jobpost/:id", async(req,res,next)=>{
    try{
        const id = req.params.id;
        const jobUpdaterId = req.query.jobUpdaterId;
        const job = await jobSchema.findById(id);
        if(!job){
            return res.status(404).send("Job not Found")
        }
        if(job){
            const jobCreatorId = job.creator.toString();
            if(jobCreatorId !== jobUpdaterId){
                return res.status(407).send("You are not authorized to access this Job")
            }
            res.status(200).json(job);
        }
    }
    catch(e){
        next(e);
    }
    
})
router.get("/jobview/:id", async(req,res,next)=>{
    try{
        const id = req.params.id;
        const job = await jobSchema.findById(id);
        if(!job){
            return res.status(404).send("Job not Found")
        }
        if(job){
            res.status(200).json(job);
        }
    }
    catch(e){
        next(e);
    }
    
})


module.exports = router;
