const mongoose= require ("mongoose")

const ProductSchema= new mongoose.Schema({           //defining the schema or structure of this particular Product model/table/collection
    title: {
        type: String,
        required:true,
        unique:true
    },

    desc: {
        type:String,
        required: true,
    },

    img: {
        type: String,
        required:true
    },

    categories: {
        type: Array,
        required: true
    },

    color: {
        type: Array,
    
    },
    
    size: {
        type: Array,
   
    },
    price: {
        type: Number,
        required:true
    },

    inStock: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})                  //this timestamps thing will itself create createdAt and updatedAt fields/column in our table/model


module.exports= mongoose.model("Product", ProductSchema);      //this line does 2 things, first it creates a model/table named Product which will follow schema of ProductSchma
//and second thing it exports it 