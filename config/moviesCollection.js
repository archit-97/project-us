const mongoose = require('mongoose');

const MoviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    runtime: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    cast: {
        type: [String],
        required: true
    },
    info: {
        type: {
            director: String,
            yearReleased: Number
        },
        required: true
    },
})

module.exports = mongoose.model('Movies', MoviesSchema);