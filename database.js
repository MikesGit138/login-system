require('dotenv').config()
const mysql = require('mysql')

//creating database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restaurant'
})
connection.connect(function(error){
    if (!error) console.log('Restaurant Database Connected')
    else console.log(error)
})

module.exports = connection