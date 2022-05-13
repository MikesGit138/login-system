if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
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

// const users = []

//set view engine to use ejs
app.set('view engine', 'ejs')

//set static folder
app.use(express.static('public'))

//urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({extended: false}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialize: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//get home route
app.get('/', (req, res) => {
    res.render('index.ejs', {name: req.body.name})
})

//get login route
app.get('/login', (req, res) => {
    res.render('login.ejs')
  })
// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   }))


app.post('/login',(req,res)=>{
  var username = req.body.username 
  var email = req.body.email;
  var password = req.body.password;
  database.query("select * from user where email = ? and password = ?",[email, password],(error, results,fields)=>{
    // console.log(error)
    // console.log(results)
    console.log(req.body)
      if(fields.length > 0){
        
          res.render('index.ejs', {username: req.body.username})
          // res.send('horay!')
      }

      else{
          res.redirect('/login')
          // console.log(results.length)
          
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
                    //async used for 'try catch'
    // try{
        const hashedPassword = await bcrypt.hash(req.body.password, 1)
                             //await used becuase it is asynchronous and will return after waiting
        let data = {
            // id: Date.now().toString(),
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        let sql = "INSERT INTO restaurant.user SET ?"
        let query = connection.query(sql, data, (err, results) =>{
                                if(err) throw err
                                res.redirect('/login')
                                console.table(results)
    
            })
    // }catch{
    //     res.redirect('/register')

    // }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  // function checkAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next()
  //   }
  
  //   res.redirect('/login')
  // }
  
  // function checkNotAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return res.redirect('/')
  //   }
  //   next()
//}
app.listen(3000)