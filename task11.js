const express=require('express');
const app=express();
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// require('dotenv').config();
const secretKey="123secret"

const users=[];

app.use(bodyParser.json());

// Middleware to verify JWT token
function verifyToken(req,resp,next){
    const bearerHeader=req.headers['authorization'];
    if(typeof bearerHeader!='undefined')
    {
        const bearer=bearerHeader.split(" ");
        const token=bearer[1];
        req.token=token;
        next();//gives control to the api created
    }
    else
    {
        resp.send({
            result:"token is not valid"
        })
    }
}

// const transporter=nodemailer.createTransport({
//     service:"Gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// })

app.post('/signUp',async (req,resp)=>{
    try{
        const{email,password}=req.body;
//user represents an individual object in user
        const existingUser =users.find(user=>user.email === email)
        if(existingUser)
        {
            return resp.status(400).json({message:'User already  exists'});
        }
        const hashedPass=await bcrypt.hash(password, 10);

        users.push({email, password:hashedPass});
       
        resp.status(201).json({message:"User created succesfully"});

        // const mailOptions={
        //     from:process.env.EMAIL_USER,
        //     to:email,
        //     subject:"welcome",
        //     text:"Hello there"
        // };

        // transporter.sendMail(mailOptions,(err,info)=>{
        //     if(err)
        //     {
        //         console.log(err)
        //         console.log("Error in sending mail")
        //     }
        //     else
        //     {
        //         console.log("Email sent successfully",info.response)
        //     }
        // })
    }
    catch(err)
    {
        console.log(err)
        resp.status(500).json({message:"Internal server error"});
    }
    console.log(users)
});

app.post('/login',async(req,resp)=>{
    try{
        const{email,password}=req.body;
        const user=users.find(user=>user.email === email)
        if(!user)
        {
            return resp.status(401).json({message:'Invalid username or password'});
        }
        const passMatch= await bcrypt.compare(password,user.password);
        if(!passMatch)
        {
            return resp.status(401).json({message:"Invalid username or password"});
        }

        const token=jwt.sign({email: user.email},secretKey,{ expiresIn: '1h' });
        resp.status(200).json({token})
    }
    catch(error){
        console.log(error);
        resp.status(400).json({message:"Internal server error"});
    }
})
app.get("/profile",verifyToken,(req,resp)=>{
    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err)
        {
            resp.send({result:"invalid token"});
        }
        else
        {
            resp.json({
                message:"profile accessed",
                authData
            })
        }
    })
})


app.listen(5000);
