const express = require('express');

const app = express();

const bodyParser = require('body-parser');

//.env file contains $PORT provided by Heroku
require('dotenv').config({ path: `./.env.local` });

app.use(bodyParser.json());

//Importing Routes to handle API calls
const postsRoute = require('./routes/posts');
const moviesRoute = require('./data/movies');

//Defining Routes
app.get('/', (req, res) =>{
	res.send('Home page of Subtraction API. Please visit https://github.com/archit522/Subtraction_API for detailed instructions on using the API');
});

app.use('/posts', postsRoute);
app.use('/movies', moviesRoute);

//Using $PORT provided by Heroku or 3000 if testing on local machine
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jhatu', {useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if(error){
        console.log("Error: cant connect to mongodb");
    }
    console.log("Mongodb connected");
});

import {createEntry} from './data/movies.js';

async function main(){
    const movie = await moviesRoute.createEntry("yo mama", "yo mama", "yo mama", "yo mama", "yo mama", ["yo mama", "yo mama"], {"director": "svv", "yearReleased": "vbdjv"});
    console.log(await moviesRoute.get(movie._id.str));
    const secondMovie = await moviesRoute.createEntry("yo mama 2", "yo mama 2", "yo mama 2", "yo mama 2", "yo mama 2", ["yo mama 2", "yo mama 2"], {"director": "svv 2", "yearReleased": "vbdjv 2"});
    console.log(await moviesRoute.getAll());
    const thirdMovie = await moviesRoute.createEntry("yo mama 3", "yo mama 3", "yo mama 3", "yo mama 3", "yo mama 3", ["yo mama 3", "yo mama 3"], {"director": "svv 3", "yearReleased": "vbdjv 3"});
    console.log(await moviesRoute.get(thirdMovie._id.str));
}
main();