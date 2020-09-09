const express = require('express');

const router = express.Router();

const Post = require('../models/Post');

var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');

//Request to list all posts in MongoDB
router.get('/', async (req, res) =>{
	try{
		const posts = await Post.find();
		res.status(200);
		res.json(posts);
	}catch(err){
		res.status(500);
		res.json({message: err});
	}
});

function createfunction1(req){
	// console.log(req.body.question);
	return req.body.question;
}

function totalrandom(diff){
	var c=diff.toString().length;
	var result = [];
	lmax = maxit(c);
	lmin = minit(c);
	while(result.length != 4){
		var a = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		if(a in result){
			continue;
		}
		result.push(a);
	}
	a = Math.floor(Math.random() * (3 - 0 + 1) + 0);
	result[a] = diff;
	return result;
}

function permutedoptions(t){
	var permutation = [];
	while(t != 0){
		permutation.push(t%10);
		t = t/10;
	}
	console.log(permutation);
	permutation.reverse();
	var length = permutation.length, 
	result = [permutation.slice()], 
	c = new Array(length).fill(0), 
	i = 1, k, p;

	while(i < length){
		if(c[i] < i){
			k = i % 2 && c[i];
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			++c[i];
			i = 1;
			console.log(permutation.slice());
			result.push(permutation.slice());
		}
		else{
			c[i] = 0;
			++i;
		}
	}
	var processed = [];
	for(i=0; i<result.length; i++){
		if(result[0] == 0){
			continue;
		}
		var s=0;
		for(var j=0; j<result[i].length; j++){
			s = s*10 + result[i][j];
		}
		processed.push(s);
	}
	return processed;
}

function checkit(m, s){
	while(m != 0 && s != 0){
		const a = m % 10;
		const b = s % 10;
		if(a < b){
			return 1;
		}
		m = m/10;
		s = s/10;
	}
	return 0;
}

function maxit(p){
	var s = 0;
	for(var i=1; i<=p; i++){
		s = s*10 + 9;
	}
	return s;
}

function minit(p){
	return Math.pow(10, p-1);
}

//Request to create a new post in MongoDB 
router.post('/', async (req, res) =>{
	// console.log(req.body.question);
	const f = req.body.minuend;
	const g = req.body.subtrahend;
	fmax = maxit(f);
	fmin = minit(f);
	gmax = maxit(g);
	gmin = minit(g);
	const flag = req.body.flag;
	var m = [], s = [], op = [], ans = [];
	for(var i = 1; i <= req.body.question; i++){
		a = Math.floor(Math.random() * (fmax - fmin + 1) + fmin);
		b = Math.floor(Math.random() * (gmax - gmin + 1) + gmin);
		if(b > a || checkit(a, b) != flag){
			i = i-1;
			continue;
		}
		m.push(a);
		s.push(b);
		ans.push(a-b);
		op.push(totalrandom(a-b));
		// op.push(permutedoptions(a-b));
	}
	res.json({minuend: m, subtrahend: s, correct_answer: ans, option: op});
	// const post = new Post({
	// 	title: req.body.title,
	// 	description: req.body.description
	// });

	// try{
	// 	const savedPost = await post.save();
	// 	res.status(200);
	// 	res.json(savedPost);
	// } catch(err){
	// 	res.status(500);
	// 	res.json({message: err});
	// }
});

//URL to get back a specific post with the given postId
router.get('/:postId', async (req, res) =>{
	try {
		//First checks for a hit in the redis cache
		redis.get(req.params.postId, async (err, reply) =>{
			if(err){
				console.log(err);
				res.status(500);
				res.json({message: err});
			}
			else if(reply){
				console.log(reply);
				res.status(200);
				res.json(reply);
			}
			else{
				//If there is a miss, check in the MongoDB and update cache accordingly
				const post = await Post.findById(req.params.postId);
				redis.set(req.params.postId, JSON.stringify(post));
				redis.expire(req.params.postId, 3000);
				res.status(200);
				res.json(post);
			}
		})
	}catch(err){
		res.status(500);
		res.json({message: err});
	}
});

//URL to delete a specific post with the given postId
router.delete('/:postId', async (req, res) =>{
	try {
		//Delete post from MongoDB as well as redis cache if present
		const removedPost = await Post.remove({_id: req.params.postId});
		redis.del(req.params.postId, function(err, reply){
			console.log(reply);
		});
		res.status(200);
		res.json(removedPost);
	}catch(err){
		res.status(500);
		res.json({message: err});
	}
});

//URL to update a specific post's title as given in postId
router.patch('/:postId', async (req, res) =>{
	try {
		//Update post title in MongoDB
		const updatepost = await Post.findOneAndUpdate(
			{_id: req.params.postId},
			{$set: {title: req.body.title}},
			{new: true}, function(err, doc){
				if(err){
					res.status(500);
					res.json({message: err});
				}
				else if(!doc){
					res.status(400);
					console.log("Missing doc");
				}
				else{
					//Update post title in redis cache as well
					redis.set(req.params.postId, JSON.stringify(doc));
					redis.expire(req.params.postId, 3000);
					res.status(200);
					res.json(doc);
				}
			}
			);
	}catch(err){
		res.status(500);
		res.json({message: err});
	}
})

module.exports = router;