const express = require('express')
const User = require('../models/User')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const {body , validationResult} = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'secRetSihaVeholdiNMyheartBaByijUstWannBeYourS'

/* Create new user using post method to api/auth/createuser  */
router.post('/createuser', [
    body('name','Enter valid Name').isLength({min:3}),
    body('email','Enter valid Email').isEmail(),
    body('password','Password must be atleast 5 character').isLength({min:5})
] , async(req,res) => {
    /* We can save the user also loke this
    console.log(req.body)
    const user = User(req.body);
    user.save()
    res.send(req.body) 
    */

   /* If there are errors , return bad request and errors */
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    /* Check whether user with same email already exists */
    try{ 
        let user = await User.findOne({email:req.body.email});
        if(user){
            res.status(400).json({Error:'Sorry User with this email already exists ...'})
        }

        /*Create a secur paasowrd usinh hash and salt for user */
        const salt = await bcrypt.genSalt(10)
        securePass = await bcrypt.hash(req.body.password,salt);

        /* create new user and save his data from request body */
        user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            date: req.body.date
        })

        /* we will use id of newly created user to fetch the data and to create jwt token */
        const data = {
            user:{
                id: user.id
            }
        }

        /*Sign jwt token with secret key */
        const jwt_token = jwt.sign(data, JWT_SECRET)
        console.log(jwt_token)
        /*
          instead of sending just any response now we will send the jw token to user so that
          user can access our api using that token
          res.json(user)
         */
        res.json({jwt_token})
   } 
   /* Hanlde error if any occured in code */
   catch(error){
        console.log(error.message);
        res.status(500).send('Internal Server Error')
   }
    
})

/*Authenticate the user using:POST method /api/auth/login */
router.post('/login', [
    body('email','Enter valid Email').isEmail(),
    body('password','Password cannot be blank ').exists()
] , async(req,res) => {
     /* If there are errors , return bad request and errors */
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()})
     }

     /* retrive email and password , provided by user */
     const {email,password} = req.body

     /*Check if given email user exits in database */
     try{
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({error:'Please try to login with valid Credentials'})
        }

        /* If user exits with given mail id then check if password is correct 
           compare function takes string and hash as parameter
           it compares user provided password and password saved in database in hash format
        */
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
            return res.status(404).json({error:'Please try to login with valid Credentials'})
        }

        /*If password is correct fetch user id to create jwt token*/
        const payload = {
            user:{
                id : user.id
            }
        }

        const jwt_token = jwt.sign(payload,JWT_SECRET)
        res.json({jwt_token})

     } catch(error){
        console.log(error.message);
        res.status(500).send('Internal Server Error')
     }
})

/* Get logged in User details using POSt method /api/auth/getuser
   this route accept middleware function fetchuser , from fetchuser function we will get the id of user
*/
router.post('/getuser',fetchuser, async(req,res) => {
    try{
        userId = req.user.id
        /* based on id we will find that user in database and send all the data of that user
           except password
        */
        const user = await User.findOne({_id:userId}).select('-password')
        res.send(user)
    } catch (error){
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router