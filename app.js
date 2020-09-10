const express = require('express');

const app = express();

const bodyParser = require('body-parser');

//.env file contains $PORT provided by Heroku
require('dotenv').config({ path: `./.env.local` });

app.use(bodyParser.json());

//Importing Routes to handle API calls
const postsRoute = require('./routes/posts');

//Defining Routes
app.get('/', (req, res) =>{
	res.send('Home page of Subtraction API. Please visit https://github.com/archit522/Subtraction_API for detailed instructions on using the API');
});

app.use('/posts', postsRoute);

//Using $PORT provided by Heroku or 3000 if testing on local machine
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
