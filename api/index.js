const express= require ('express')
const dotenv= require ("dotenv")
const mongoose= require("mongoose")
const userRoute= require("./routes/user")
const authRoute= require("./routes/auth")
const productRoute= require("./routes/product")
const cartRoute= require("./routes/cart")
const orderRoute= require("./routes/order")
const cors = require('cors');

const app= express();  //our server

dotenv.config();
 
mongoose
.connect(process.env.DB_URL)
.then(()=>{console.log("DataBase connection successful")})
.catch((err)=>{console.log(err)})

app.use(cors());
app.use(express.json());   //middleware

app.use("/api/user", userRoute)        //so notice tht we have given the base paths here in middleware
app.use("/api/auth", authRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

app.listen(process.env.PORT || 5000, ()=> {
    console.log("Server is running in the background") 
})