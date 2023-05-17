const mongoose= require ("mongoose")

const OrderSchema= new mongoose.Schema({           //defining the schema or structure of this particular Order model/table/collection
    
    userId: {
        type: String,
        required:true,
    },

    products: 
    [
        {
            productId:
            {
                type:String,
                required: true
            },
            quantity:
            {
                type:Number,
                default: 1
            }
        }
    ],
    amount:{
        type: Number,
        required:true
    },

    address:{
        type: Object,
        required: true 
    },

    status:{
        type: String,
        default: "Pending"
    }

}, {timestamps: true})                  //this timestamps thing will itself create createdAt and updatedAt fields/column in our table/model


module.exports= mongoose.model("Order", OrderSchema);      //this line does 2 things, first it creates a model/table named Order which will follow schema of OrderSchema
//and second thing it exports it 