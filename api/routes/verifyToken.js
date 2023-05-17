const jwt= require ("jsonwebtoken")
 


const verifyToken= (req, res, next)=> {               //this function is a middleware function tht just first initially checks if our token is verified or not or simply is user a registered user or not

  //console.log(req.headers.token)

  //earlier it was
  //const authHeader= req.headers.authorization
    const authHeader= req.headers.token
    if(authHeader)
    {

      console.log(authHeader)
        const token= authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload)=>{
            if(err)
            {
                return res.status(403).json("Token is incorrect")
            }

            req.user= payload   //payload returns user to whom the token belongs according to jwt
            next();
        })
      
    }
    else
    {
         //console.log(authHeader)
         return res.status(401).json("You are not authenticated!")
    }
}


//for actions tht a user can perform on himself or admin can perform on any user
const verifyTokenAndAuthorization= (req, res, next)=>
{
   //first verify the token and then call the callback function passed as next() in the verifytoken function
   verifyToken(req, res, ()=>{

    if(req.user.id===  req.params.id || req.user.isAdmin)
    {
       next();
    }
    else
    {
       return res.status(403).json("You are not allowed to do that")
    }
   })
}

//for actions only admin can perform
const verifyTokenAndAdmin= (req, res, next)=>
{
   verifyToken(req, res, ()=>{

    if(req.user.isAdmin) 
    {
       next();
    }
    else
    {
       return res.status(403).json("You are not allowed to do that")
    }
   })
}


module.exports= {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}