const express= require("express")
const Product = require("../models/Product")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require("./verifyToken")
const router= express.Router()
const app=express()



/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });*/




//CREATE a new product something tht only the admin can do
router.post("/", verifyTokenAndAdmin, async (req, res)=>{

    const newProduct= new Product(req.body)
    try{
        const savedUser= await newProduct.save()
        res.status(200).json(savedUser)
    }
    catch(err){ 
        res.status(500).json(err)
    }
})


//UPDATE matlab admin wants to update something in the products 
router.put("/:id", verifyTokenAndAdmin , async (req, res)=>
{
    try {
        const updatedProduct= await Product.findByIdAndUpdate(req.params.id, {
            $set : req.body        //wht this does is takes the entire body inside req and updates it with whatever is new as provided bu the user
        }, 
        {new: true})

        res.status(200).json(updatedProduct)
    }
    catch (err){
        res.status(500).json(err)
    }
  
})


//DELETE matlab admin wants to delete any product
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET ANY Product something tht anybody can do even those who arent registered hence u can see theres no middleware function for token verification and authorization

router.get("/find/:id",  async(req, res)=>
{
    res.header('Access-Control-Allow-Origin', "*");
    try{
        const product= await Product.findById(req.params.id)
        res.status(200).json(product)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET ALL PRODUCTS

router.get("/",  async(req, res)=>{

    const qnew= req.query.new
    const qcategory=req.query.category
    res.header('Access-Control-Allow-Origin', "*");
    try{
         let products;

         if(qnew)
         {
            products= await Product.find().sort({createdAt: -1}).limit(2)
         }
         else if (qcategory){
            products= await Product.find({
                categories: {$in: [qcategory]}
        })
        
    }
    else
    {
        products= await Product.find()
    }

    res.status(200).json(products)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports= router;


