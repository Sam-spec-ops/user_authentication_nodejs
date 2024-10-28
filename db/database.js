const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'chatbot',
});
connection.connect((error)=>{
    if(error){
        console.log('Connection failed')
    }
    else{
        const createUser = "CREATE TABLE IF NOT EXISTS `users`(`id` INT(14) PRIMARY KEY AUTO_INCREMENT,`name` VARCHAR(150) NOT NULL,`username`VARCHAR(200) NOT NULL,`email` VARCHAR(250) NOT NULL,`password` LONGTEXT NOT NULL,`reg_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
        connection.query(createUser, (err,result)=>{
            if (err) throw err
            if (result){
                console.log('Table Created')
            }
        })
        console.log('Database Connected')
    }
})
module.exports=connection