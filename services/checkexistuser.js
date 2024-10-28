const database = require('../db/databasetwo')
exports.Checkexistuser=async(email)=>{
   const SelectEmail="SELECT * FROM users WHERE email = ?"
   let message
   try {
      const [result] = await database.query(SelectEmail,{email:email})
      return message=result.length>0?'Email Already Exist':''
   } catch(error) {
      console.error(error)
   }
   console.log(message)
}