const express= require("express")
const User= require("../models/User")
const cryptoJs= require("crypto-js")
const jwt= require("jsonwebtoken")

const router= express.Router()       //we will be handling register and login pages inside this router


//REGISTER
//Handling post request from user while registering
router.post("/register", async (req, res)=>{

    res.header('Access-Control-Allow-Origin', "*");

    const newUser= new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString()             //encryptng the password using cryptojs and the secret key we defined in .env file
    })
    

    try{
     
       const savedUser= await newUser.save();         
       //so it is this .save method that actually saves tht newly created user into our database
       //moreover this .save function is an async function hence while it functions, browser also runs the statements after it, as a result of which if 
       //state,ents written after it use the fact tht newUser needs to be saved into database then it will cause error hence we use async await
       //matlab the browser waits for .save method to complete its task then only it moves forward
       res.status(201).json(savedUser);

    }

    catch(err){
       res.status(500).json(err);
    }
    
})



//LOGIN
router.post("/login", async (req, res)=>{

    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'POST');

    try
    {
               
        const user= await User.findOne({username: req.body.username})             //matlab this user finds such user from our database jiska username is same as tht of username entered by user and then it decrypts the password which is mentioned for tht user in ou database
        
        if(!user)
        {
             return res.status(401).json("Wrong credentials!")
        }

        const originalPassword= cryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET_KEY).toString(cryptoJs.enc.Utf8)
        if(originalPassword !== req.body.password)
        {
           return  res.status(401).json("Wrong credentials!")
        }

        const accessToken= jwt.sign(
        {
            id:user._id,                            //this is the payload we are sending
            isAdmin: user.isAdmin                   //also rememeber tht this web token is available in the header of the request
        }, 
        process.env.JWT_SECRET_KEY,              //secret key
        {expiresIn: "3d"}           //matlab the web token will expire in 3 days and after tht we again need to login
        )
    
        res.status(200).json({user, accessToken})   
    }                     
    catch(err){
        res.status(500).json(err)
    }
})

module.exports= router;
