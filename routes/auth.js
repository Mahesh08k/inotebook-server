const express = require('express')
const User = require('../models/User')
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
        res.status(500).send('Unable to add new user')
   }
    
})

module.exports = router