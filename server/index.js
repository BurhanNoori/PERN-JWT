const express = require('express');
const app = express();
console.log(typeof app);
const cors= require('cors');
const pool = require('./db/db_connection');
const jwtAuth = require('./routes/jwtAuth');
const port = 5300;


//MIDDLEWARES
/*express.json() is the function that parse the incoming request body into the JSON payload. 
    This method returns the middleware that only parses JSON and only looks at the requests
    where the content-type header matches the type option. For eg. {content-type: 'application/json'}
    
    JSON PAYLOAD--> Payload is the essential information in a data block that you send to or 
    receive from the serverwhen making API requests.
    */
app.use(express.json()) 


/*Calling app.use(cors()). What it doing is basically making your server accessible to any domain that requests 
a resource from your server via a browser.*/

app.use(cors());



//ROUTES

// Registration and Login Routes

app.use('/auth', jwtAuth);



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})