const express= require("express")
const Order = require("../models/Order")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}= require("./verifyToken")
const router= express.Router()


//CREATE a new order
router.post("/", verifyTokenAndAuthorization, async (req, res)=>{

    const newOrder= new Order(req.body)
    try{
        const savedOrder= await newOrder.save()
        res.status(200).json(savedOrder)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})


//UPDATE Order only admin can do this
router.put("/:id", verifyTokenAndAdmin , async (req, res)=>
{
    try {
        const updatedOrder= await Order.findByIdAndUpdate(req.params.id, {
            $set : req.body        //wht this does is takes the entire body inside req and updates it with whatever is new as provided bu the user
        }, 
        {new: true})

        res.status(200).json(updatedOrder)
    }
    catch (err){
        res.status(500).json(err)
    }
  
})


//DELETE matlab admin wants to delete any order
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})



//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const orders= await Order.find({userId: req.params.userId})
        res.status(200).json(orders)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET ALL ORDER only admin can do this
router.get("/", verifyTokenAndAdmin ,  async(req, res)=>{

    try
    {
        const orders= await Order.find()
        res.status(200).json(orders)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})


//STATS: get monthly income something tht only the admin can do
router.get("/income", verifyTokenAndAdmin, async(req, res)=>{

    const currDate= new Date()
    const lastmonth= new Date(currDate.setMonth(currDate.getMonth()-1))
    const lasttolastmonth= new Date(currDate.setMonth(currDate.getMonth()-1))

    try{
      const income= await Order.aggregate([
       {
          $match: {createdAt: {$gte: lasttolastmonth}}
       },
       {
          $project: { month: {$month : "$createdAt" },
                      sales: "$amount" }
       },
       {
          $group: 
          {
              _id: "$month",
              total: {$sum : "$sales"}
          }
       }]) 

       res.status(200).json(income)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports= router;




