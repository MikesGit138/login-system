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

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

//set view engine to use ejs
app.set('view engine', 'ejs')

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
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

//get login route
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  

//get register route
app.get('/register', checkNotAuthenticated, (req,res) =>{
    res.render('register.ejs')
})

//post register route for changes
app.post('/register', checkNotAuthenticated, async (req,res)=>{
                    //async used for 'try catch'
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
                             //await used becuase it is asynchronous and will return after waiting
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}
app.listen(3000)