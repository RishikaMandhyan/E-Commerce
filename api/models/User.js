const mongoose= require ("mongoose")

const UserSchema= new mongoose.Schema({           //defining the schema or structure of this particular User model/table/collection
  
    username: {
        type: String,
        required:true,                           
        unique:true
    },

    img:{
        type: String
    },

    email: {
        type: String,
        required:true,
        unique:true
    },

    password: {
        type: String,
        required:true
    },

    isAdmin: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})           //this timestamps thing will itself create createdAt and updatedAt fields/column in our table.model


module.exports= mongoose.model("User", UserSchema);      //this line does 2 things, first it creates a model/table named User which will follow schema of UserSchma
//and second thing it exports it 