import express from 'express'
const app = express();
const port =3000;

app.get('/',(req,res)=>{
    res.send("hello Here dd")
})

app.listen(`${port}`,()=>{
    console.log("Server is Running on Port " + port)
})
