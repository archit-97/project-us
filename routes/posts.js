const express = require('express');

const router = express.Router();


//Function to return 4 options which are highly similar to diff
function nearby(diff){
	var c = diff.toString().length;
	var result = [];
	//No need to calculate nearby options for single digit diff
	if(c < 2){
		return result;
	}
	//Possibilities(poss array) contains percentage. Eg - [10, 1, 0.1, 0.01, 0.001]
	var poss = [];
	for(var i=1; i<c; i++){
		poss.push(100/Math.pow(10, i));
	}
	while(result.length != 4){
		lmax = poss.length-1;
		lmin = 0;
		//Choose a random percentage to work with
		var a = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		//Calculate range of values possible with that percentage
		lmax = diff + Math.ceil(poss[a]*diff/100);
		lmin = diff - Math.ceil(poss[a]*diff/100);
		//Special condition for diff=10
		if(lmax - lmin < 3){
			lmax = lmax + 1;
		}
		//Calculate nearby option in selected range
		var b = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		if(b != diff && !result.includes(b)){
			result.push(b);
		}
	}
	return result;
}

//Function to return totally random 4 options for diff
function totalrandom(diff){
	var c=diff.toString().length;
	var result = [];
	//Calculate max and min numbers possible with the length of diff
	lmax = maxit(c);
	lmin = minit(c);
	while(result.length != 4){
		//Calculate nearby option in given range
		var a = Math.floor(Math.random() * (lmax - lmin + 1) + lmin);
		if(a != diff && !result.includes(a)){
			result.push(a);
		}
	}
	return result;
}

//Function to merge similar and random options to form a collective set of options for the correct answer
function compromise(diff){
	//Get list of 4 nearby and 4 totally random options for given diff
	var r1 = nearby(diff), r2 = totalrandom(diff), result = [], c = 0;
	//If r1 = [], diff is single digit and return the totally random list
	if(r1.length == 0){
		result = r2;
	}
	while(result.length != 4){
		//Choose a nearby option or totally random option based on var a
		var a = Math.floor(Math.random() * (1 - 0 + 1) + 0);
		if(a == 0){
			if(!result.includes(r1[c])){
				result.push(r1[c]);
			}
			else{
				result.push(r2[c]);
			}
		}
		else{
			if(!result.includes(r2[c])){
				result.push(r2[c]);
			}
			else{
				result.push(r1[c]);
			}
		}
		c++;
	}
	//Place the correct answer at a random position
	a = Math.floor(Math.random() * (3 - 0 + 1) + 0);
	result[a] = diff;
	return result;
}

//Check if borrowing is required while doing m - s
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

//Return maximum number possible with given number of digits. Eg- maxit(4) = 9999
function maxit(p){
	var s = 0;
	for(var i=1; i<=p; i++){
		s = s*10 + 9;
	}
	return s;
}

//Return minimum number possible with given number of digits. Eg- minit(4) = 1000
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
	//Check if each input satisfies the given constraints
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
	//Calculate maximum and minimum number possible
	fmax = maxit(f);
	fmin = minit(f);
	gmax = maxit(g);
	gmin = minit(g);
	var m = [], s = [], op = [], ans = [];
	for(var i = 1; i <= q; i++){
		//Generate random minuend and subtrahend
		a = Math.floor(Math.random() * (fmax - fmin + 1) + fmin);
		b = Math.floor(Math.random() * (gmax - gmin + 1) + gmin);
		//Check for flag and a >=b
		if(b > a || checkit(a, b) != flag){
			i = i-1;
			continue;
		}
		//Push into a list
		m.push(a);
		s.push(b);
		ans.push(a-b);
		op.push(compromise(a-b));
	}
	//Show results
	res.json({minuend: m, subtrahend: s, correct_answer: ans, option: op});
});

module.exports = router;