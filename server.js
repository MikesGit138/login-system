const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const mysql = require('mysql')
const app = express()


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

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use static folder
app.use(express.static('public'))

//login route
app.get('/login', (req,res) =>{
    res.render('login.ejs')
})

//register route
app.get('/register', (req,res)=>{
    res.render('register.ejs')
})

//home page route
app.get('/', (req,res)=>{
    res.render('index.ejs')
})



//server listening
app.listen (3000, () => {
    console.log('Server is running at port 3000')
})