const mongoose= require ("mongoose")

const CartSchema= new mongoose.Schema({           //defining the schema or structure of this particular Cart model/table/collection
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
]

}, {timestamps: true})                  //this timestamps thing will itself create createdAt and updatedAt fields/column in our table/model


module.exports= mongoose.model("Cart", CartSchema);      //this line does 2 things, first it creates a model/table named Cart which will follow schema of CartSchema
//and second thing it exports it 