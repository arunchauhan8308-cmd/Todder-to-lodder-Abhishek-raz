const express = require('express')
const app = express();

// middleware
app.use(express.json())

app.get('/',(req,res)=> {
    res.send("Abhishek Raj")
})

app.listen(process.env.PORT, ()=> {
    console.log("Server is running...")
})