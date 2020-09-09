const express = require('express');

const router = express.Router();


//
function nearby(diff){
	var c = diff.toString().length;
	var result = [];
	if(c < 2){
		return result;
	}
	var poss = [];
	for(var i=1; i<c; i++){
		poss.push(100/Math.pow(10, i));
	}
	console.log(poss, diff);
	while(result.length != 4){
		lmax = poss.length-1;
		lmin = 0;
		var a = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		lmax = diff + Math.ceil(poss[a]*diff/100);
		lmin = diff - Math.ceil(poss[a]*diff/100);
		// console.log(lmax, lmin);
		var b = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		if(!result.includes(b) && b != diff){
			result.push(b);
		}
	}
	return result;
}

function totalrandom(diff){
	var c=diff.toString().length;
	var result = [];
	lmax = maxit(c);
	lmin = minit(c);
	while(result.length != 4){
		var a = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		if(!result.includes(a) && a != diff){
			result.push(a);
		}
	}
	// a = Math.floor(Math.random() * (3 - 0 + 1) + 0);
	// result[a] = diff;
	return result;
}

function compromise(diff){
	var r1 = nearby(diff);
	console.log(r1);
	var r2 = totalrandom(diff), result = [], c = 0;
	console.log(r2);
	console.log("----------------------");
	if(r1.length == 0){
		result = r2;
	}
	while(result.length != 4){
		var a = Math.floor(Math.random() * (1 - 0 + 1) + 0);
		if(a == 0){
			result.push(r1[c]);
		}
		else{
			result.push(r2[c]);
		}
		c++;
	}
	a = Math.floor(Math.random() * (3 - 0 + 1) + 0);
	result[a] = diff;
	return result;
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
	if(p == 1){
		return 0;
	}
	return Math.pow(10, p-1);
}

//Request to generate and return a question bank based on the given inputs and constraints 
router.post('/', async (req, res) =>{
	const f = req.body.minuend;
	const g = req.body.subtrahend;
	const flag = req.body.flag;
	const q = req.body.question;
	if(Number.isInteger(f) == false || f < 1 || f > 10){
		res.json({message: "Incorrect minuend input"});
	}
	if(Number.isInteger(g) == false || g < 1 || g > 10 || f < g){
		res.json({message: "Incorrect subtrahend input"});
	}
	if(!(Number.isInteger(flag) == true && (flag == 0 || flag == 1))){
		res.json({message: "Incorrect flag input"});
	}
	if(Number.isInteger(q) == false || q < 0){
		res.json({message: "Incorrect number of questions input"});
	}
	fmax = maxit(f);
	fmin = minit(f);
	gmax = maxit(g);
	gmin = minit(g);
	var m = [], s = [], op = [], ans = [];
	for(var i = 1; i <= q; i++){
		a = Math.floor(Math.random() * (fmax - fmin + 1) + fmin);
		b = Math.floor(Math.random() * (gmax - gmin + 1) + gmin);
		if(b > a || checkit(a, b) != flag){
			i = i-1;
			continue;
		}
		m.push(a);
		s.push(b);
		ans.push(a-b);
		op.push(compromise(a-b));
		// op.push(permutedoptions(a-b));
	}
	res.json({minuend: m, subtrahend: s, correct_answer: ans, option: op});
});

module.exports = router;