const database = require('../db/databasetwo')
exports.Checkexistusername=async(username)=>{
   const SelectUsername="SELECT username FROM users WHERE ?"
   let message
   try {
      const [result] = await database.query(SelectUsername,{username:username})
      return message=result.length>0?'Username Already Exist':''
   } catch(error) {
      console.error(error)
   }
   console.log(message)
}