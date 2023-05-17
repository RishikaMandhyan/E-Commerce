const express= require("express")
const User = require("../models/User")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require("./verifyToken")     //these 3 functions act as middleware functions
const router= express.Router()



//UPDATE matlab user wants to update something in his profile or admin wants to update any user's profile
router.put("/:id", verifyTokenAndAuthorization , async (req, res)=>
{
    res.header('Access-Control-Allow-Origin', "*");

    if(req.body.password)
    {        //if the user updated or changed hispassword we need to encrypt tht again na
        password= cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString()
    }

    try 
    {
        const updatedUser= await User.findByIdAndUpdate(req.params.id, {
            $set : req.body        //wht this does is takes the entire body inside req and updates it with whatever is new as provided bu the user
        }, 
        {new: true})
        
        res.status(200).json(updatedUser)
    }
    catch (err){
        res.status(500).json(err)
    }
  
})


//DELETE matlab user wants to delete himself or admin wants to delete any user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    res.header('Access-Control-Allow-Origin', "*");

    try
    {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})


//GET ANY USER something tht only the admin can do
router.get("/find/:id", verifyTokenAndAdmin, async(req, res)=>{

    res.header('Access-Control-Allow-Origin', "*");
    try
    {
        const user= await User.findById(req.params.id)
        const  {password, ...others}= user._doc
        res.status(200).json(others)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET ALL USERS something tht only the admin can do
router.get("/", verifyTokenAndAdmin, async(req, res)=>{

    res.header('Access-Control-Allow-Origin', "*");

    try
    {

        const users= await User.find()
        res.status(200).json(users)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET USER STATS per month something tht only admin can do

router.get("/stats", verifyTokenAndAdmin, async (req, res)=>{

    res.header('Access-Control-Allow-Origin', "*");
    
    const currDate= new Date()
    const lastyearDate= new Date(currDate.setFullYear(currDate.getFullYear()-1))

    try
    {
       const data= await User.aggregate([          //we are creating an aggregation pipeline with 3 stages as below
        {
            $match: { createdAt :{$gte : lastyearDate}}            //first stage gets those documents whose createdAt date is greater than or equal to lastyearDate
        },
        {
            $project : {month:{$month : "$createdAt"}}            //the second stage now gets the documents filtered from first stage and finds the month of the createdAt date and stores it in a new month variable
        },
        { 
            $group: {_id: "$month", totalusers: { $sum: 1} }          //this will get data from 2nd stage and and takes id= month variable matlab it groups tht data according to their months
            //after grouping according to the month it will calculate sum of all documents(here users created) in tht month and stores it in totalusers variable
        }
        ])

        res.status(200).json(data)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})

module.exports= router;
