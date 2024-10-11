var jwt = require('jsonwebtoken');
const JWT_SECRET = 'secRetSihaVeholdiNMyheartBaByijUstWannBeYourS'

/* this function will following task :
    1.get the user from jwt token
    2.add that id to request object
*/
const fetchuser = (req,res,next) => {
    /* get auth token from req header  */
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:'Please authenticate using valid token'})
    }
    /* match auth token with secret key if matches then get the id of user from that token
       and pass that id to req
    */
    try{
        const data = jwt.verify(token , JWT_SECRET);
        req.user = data.user
    } 
    catch(error){
        /* Here return keyword is very important because this is middleware function
           that means it passes the control to next function after execution , now if error 
           occured res.send will get called and control will pass to nect function and in next
           function if res.send code is there then it will break the code since res is alredy sent in
           catch to show error
           so it is important to stop code execution once we recive error in middleware function to
           prevent code breaking if error occurs 
        */
       return res.status(401).send({error:'Please authenticate using valid token'})
    }
   
    next()
}

module.exports = fetchuser