require('dotenv').config()

var bodyParser = require('body-parser')

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
// const flash = require('connect-flash');
const session = require('express-session')
const methodOverride = require('method-override')

const database = require('./database')

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

//set view engine to use ejs
app.set('view engine', 'ejs')

//set static folder
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({extended: false}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//get home route
app.get('/', (req, res) => {
    res.render('index.ejs', {username: req.body.username})
})

//get login route
app.get('/login', (req, res) => {
    res.render('login.ejs')
  })

app.post('/login',(req,res)=>{
  
  let email = req.body.email;
  let password = req.body.password;

  console.log(email);
  console.log(password);
  
  database.query("select * from restaurant.user where email = ?",[email],(error, results,fields)=>{
    if (error) throw error
    console.log(results);

      if(results.length > 0 && bcrypt.compare(password,results[0].password)){
          res.render('index.ejs'  , {username: req.body.email})
          req.session.loggedin = true;
				  req.session.email = email;
      }

      else{
        req.flash('messages', {messages:{error:'incorrect credentials'}})
          res.redirect('/login')
      }
      res.end()
  })
})


//get register route
app.get('/register', (req,res) =>{
    res.render('register.ejs')
})

//post register route for changes
app.post('/register', async (req,res)=>{
                  
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
                             //await used becuase it is asynchronous and will return after waiting
        let data = {
           
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }
        let sql = "INSERT INTO restaurant.user SET ?"
        let query = connection.query(sql, data, (err, results) =>{
                                if(err) throw err
                                res.redirect('/login')
                                console.table(results)
    
            })
    
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  
app.listen(3000)