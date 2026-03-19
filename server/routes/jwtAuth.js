
const router = require('express').Router();
const pool = require('../db/db_connection');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');

//registering

router.post('/register', async (req,res)=>{
    try {
        // It is the 5 step process:
        // 1. destructuring the req.body

        const {name,email,password} = req.body;

        // 2. check if the user exist (if exist then throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email=$1",[email]);
        //console.log('user: ',user);
       
        if(user.rows.length !==0){
           return res.status(401).send("User Already Exist");
        }
    
        // 3. If user doesn't exist then bcrypt its password
        
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);


        
        // 4. Save user into our database 'jwtauth'

        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *", 
            [name,email,bcryptPassword]);
        console.log('newUser',newUser);

        // 5. generating json web token for the users
        
        const token = jwtGenerator(newUser.rows[0].user_id);
        console.log('token: ',{token});
        res.json({token});

        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
})

router.post('/login', async(req,res)=>{
    const {name, email,password} = req.body;

    try {
        // 1. Destructure the req.body
        const {name, email, password} = req.body;

        // 2. Check if user exist or not (If not exist then throw an error)
        const user = await pool.query(
            "SELECT * FROM users WHERE user_name=$1 && user_email=$2",
            [name, email]);
        if (!user)
            return res.status(401).send("Invalid Credentials.");
        
        // 3. If exist then match the password with database record
        const validPassword = await bcrypt.compare(password,user.rows[0].user_password);
        if(!validPassword)
            return res.status(401).send("Invalid Password");
            
        // 4. Give the user a token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})


module.exports = router;