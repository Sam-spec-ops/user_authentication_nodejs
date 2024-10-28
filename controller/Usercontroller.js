//insert
//delete
//select by id
//select
//update
const bcrypt=require('bcrypt');
const database = require('../db/database');
const { Checkexistuser } = require('../services/checkexistuser');
const { Checkexistusername } = require('../services/checkexistusername');
const socketID = require('socket.io');
const http = require('http')
const server = http.createServer();
const io = socketID(server); 
const transporter   = require('../services/emailservices');

exports.InsertUser=async(req,res)=>{
    const {name, email, username, password} = req.body
    if(!name||!email||!username||!password){
        res.json({
            message:'Fill the Empty field',
        })
        return
    }
    const hashpassword = await bcrypt.hash(password,12)

    //check for existing username
    const resultmessage = await Checkexistuser(email)
    if(resultmessage){
        res.status(201).json({message:resultmessage})
        return
    }
    const resultmessage2 = await Checkexistusername(username)
    if(resultmessage2){
        res.status(201).json({message:resultmessage2})
        return 
    }
    const data={name:name,email:email,username:username,password:hashpassword}
    const InsertSql ="INSERT INTO users SET ?"
    database.query(InsertSql, data, (err,result)=>{
        if(err) throw err
        if(result){
            res.status(201).json({message:"Recorded Successful"})
        }
    })
     
};


exports.VerifyEmail =async(req,res)=>{
    const {email}=req.body
    const randNumber = Math.floor(Math.random()*900000)+100000
    req.session.randNumber=randNumber
    console.log(randNumber)
    const timestamp=new Date().getTime() //milliseconds
    //convert to seconds
    const timestampsecs=timestamp/1000
    console.log(timestampsecs)

    try {
        transporter.sendMail({
            from: '"Chat Bot 👻" <services@chatbot.com>', // sender address
            to: email, // list of receivers
            subject:"Email Verification", // Subject line
            html: `<b>${randNumber}</b>`, // html body
          });
          req.session.timestampsecs=timestampsecs
          res.status(201).json({message:'Email Sent'})
    } catch (error) {
        res.status(403).json({message:'Email Not sent'})
    }
   
}
exports.VerifyOtp=(req,res)=>{
    const {otp} = req.body
    const serverotp = req.session.randNumber
    const getsecfromsession=req.session.timestampsecs+60
    const getcurrenttimestamp=new Date().getTime()/1000

    if (getcurrenttimestamp>getsecfromsession){
        res.status(201).json({message:'Otp Expired'})
        return
    }
    // get current time
    if(otp==serverotp){
        res.status(201).json({message:'Otp Correct'})
    }
    else {
        res.status(201).json({message:'Otp Incorrect'})
    }
}
exports.LoginUser=(req,res)=>{
    const {username, password} = req.body
    const selectUser = 'SELECT * FROM users WHERE username = ?'
    database.query(selectUser,[username],async(error,result)=>{
        if(error) throw error
        if(result.length<1){
            res.status(201).json({message:'Incorrect Username'})
        }
        const passwordFromTable = result[0].password
        const checkPassword = await bcrypt.compare(password,passwordFromTable)
        if(checkPassword){
            res.status(201).json({message:'Login Successful'})
        }
        else{
            res.status(201).json({message:'Incorrect Password'})
        }
    })
}
exports.MessageUser=(req,res)=>{
    const {receiverID,senderID,message}=req.body
    const userSockets = new Map();
    io.on('connection',(socket)=>{
        console.log('connection');
        socket.on('login',(username)=>{
            console.log(`User logged in: ${username}`)
            userSockets.set(username,socket);
        })
    })
    res.status(201).json({message:'socket'})
}