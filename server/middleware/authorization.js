const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req,res,next) => {
    try {
        const jwtToken = req.header('token');
        console.log('req.header', jwtToken);
        if(!jwtToken) 
            return res.status(403).send("Not Authorized");
        const payload = jwt.verify(jwtToken,process.env.jwtSecret); //it returns an object name user = {id:user_id}
        req.user = payload.user;
        
    } catch (error) {
        console.error(error.message);
        res.status(403).send("Not Authorized");
    }
}