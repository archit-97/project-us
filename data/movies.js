// const mongoose = require('mongoose');
const express = require('express');
const { mongo } = require('mongoose');
const Movies = require('../config/moviesCollection');
const router = express.Router();
const ObjectId = require('mongoose').ObjectId;

router.get('/', (req, res) => {
    res.send('we are on movies');
})

router.post('/', async (req, res) => {
    // res.send(req.body);
    const body = req.body;
    console.log('here1 ');
    await getAll();
    await get();
    const entry = await createEntry(body.title, body.plot, body.rating, body.runtime, body.genre, body.cast, body.info);
    // const movie = new Movies({
    //     title: body.title,
    //     plot: body.plot,
    //     rating: body.rating,
    //     runtime: body.runtime,
    //     genre: body.genre,
    //     cast: body.cast,
    //     info: body.info
    // })
    // console.log("here2 ", movie);
    // movie.save()
    // .then(data => {
    //     console.log(data);
    //     res.json(data);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.json({"message": "error in saving movie"});
    // })
    const cursor = await mongo
    if(entry){
        res.json(entry);
    }
    res.json(entry);
})

router.get('/all', async (req, res) => {
    const movies = await getAll();
    if(movies){
        res.json(movies);
    }
    res.json({message: "error in fetching all documents"});
    // res.json({message: err});
})

router.post('/specific', async (req, res) => {
    const movie = await get(req.body.id);
    if(movie){
        res.json(movie);
    }
    res.json({message: "error in fetching specific document"});
})

router.post('/delete', async(req, res) => {
    const movie = await remove(req.body.id);
    if(movie){
        res.json(movie);
    }
})

router.post('/update', async (req, res) => {
    const movie = await rename(req.body.id, req.body.title);
    if(movie){
        res.json(movie);
    }
})

async function createEntry(title, plot, rating, runtime, genre, cast, info){
    console.log(title, plot, rating, runtime, genre, cast, info)
    if(title || plot || rating || runtime || genre || cast || info){
        throw "some parameters are not provided";
    }
    if(!isStringCorrect(title) || !isStringCorrect(plot) || !isStringCorrect(rating) || !isStringCorrect(runtime) || !isStringCorrect(genre)){
        throw "type of string parameters is not correct";
    }
    if(!isCorrectFormat(cast)){
        throw "cast array is not correct";
    }
    if(typeof(info) != Object){
        throw "type of info is not correct";
    }
    if(!isStringCorrect(info.director)){
        throw "type of info.director is not correct";
    }
    if(!info.yearReleased || info.yearReleased.toString().length != 4 || info.yearReleased < 1930 || info.yearReleased > new Date().getFullYear() + 5){
        throw "typeof info.yearReleased is not correct";
    }


    const movie = new Movies({
        title: title,
        plot: plot,
        rating: rating,
        runtime: runtime,
        genre: genre,
        cast: cast,
        info: info
    })

    await movie.save()
    .then(data => {
        console.log(data);
        return(data);
    })
    .catch(err => {
        console.log(err);
        return null;
    })
}

async function getAll(){
    try{
        const movies = await Movies.find();
        console.log(JSON.stringify(movies));
        return movies;
    }
    catch(err){
        throw err;
        return null;
    }
}

async function get(id){
    // id = new ObjectId(id);
    if(!isStringCorrect(id)){
        throw "typeof id is not correct";
    }
    try{
        console.log(id);
        const movie = await Movies.findById(id);
        console.log("-------------------");
        console.log(movie);
        console.log("-------------------");
        return movie;
    }
    catch(err){
        throw err;
        return null;
    }
}

async function remove(id){
    if(!isStringCorrect(id)){
        throw "typeof id is not correct";
    }
    try{
        console.log(id);
        const movie = await Movies.findByIdAndDelete(id);
        console.log("-------------------");
        console.log(movie);
        console.log("-------------------");
        return movie;
    }
    catch(err){
        throw err;
        return null;
    }
}

async function rename(id, title){
    if(!isStringCorrect(id)){
        throw "typeof id is not correct";
    }
    if(!isStringCorrect(title)){
        throw "typeof title is not correct";
    }
    try{
        console.log(id, title);
        const movie = await Movies.findByIdAndUpdate(id, {title: title});
        console.log("-------------------");
        console.log(movie);
        console.log("-------------------");
        return movie;
    }
    catch(err){
        throw err;
        return null;
    }
}

function isStringCorrect(str){
    console.log(str);
    if(!str || typeof(str) != String || str.trim().length == 0){
        return false;
    }
    return true;
}

function isCorrectFormat(cast){
    console.log(cast);
    if(!cast || typeof(cast) != [String] || cast.length == 0){
        return false;
    }
    for(let i=0; i<cast.length; i++){
        if(cast[i].trim.length == 0){
            return false;
        }
    }
    return true;
}

module.exports = router;
