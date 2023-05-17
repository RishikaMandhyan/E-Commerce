const express= require("express")
const Cart = require("../models/Cart")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require("./verifyToken")
const router= express.Router()


//CREATE a new cart 
router.post("/", verifyTokenAndAuthorization, async (req, res)=>{

    const newCart= new Cart(req.body)
    try{
        const savedCart= await newCart.save()
        res.status(200).json(savedCart)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//UPDATE matlab user wants to update something in the cart 
router.put("/:id", verifyTokenAndAuthorization , async (req, res)=>
{
    try {
        const updatedCart= await Cart.findByIdAndUpdate(req.params.id, {
            $set : req.body        //wht this does is takes the entire body inside req and updates it with whatever is new as provided bu the user
        }, 
        {new: true})

        res.status(200).json(updatedCart)
    }
    catch (err){
        res.status(500).json(err)
    }
  
})


//DELETE matlab user wants to delete his own cart or admin can also do
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})



//GET USER Cart
router.get("/find/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const cart= await Cart.findById(req.params.id)
        res.status(200).json(cart)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET ALL CARTS only adrmin can do this

router.get("/",verifyTokenAndAdmin,  async(req, res)=>{

    try{
        const cart= await Cart.find()
        res.status(200).json(cart)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports= router;



