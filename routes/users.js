const express= require('express');
const router = express.Router();
require('../models/Idea');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/youtube',{})
	.then(() => console.log('Mongodb Connected...'))
	.catch(err => console.log(err));

// Load User Model

require('../models/User');
const User = mongoose.model('users');
// In this file we are not having access to app so we are changing
// app to router.
const Idea = mongoose.model('ideas');

//Passport config
require('../config/passport')(passport);

    router.post('/login',(req,res,next) =>{
		console.log("inside login");
		passport.authenticate('local',{
		successRedirect:'/ideas',
		failureRedirect: '/users/login',
		failureFlash : true
	})(req,res,next);
	// Not go to config file to check the working of local stragegy
});
	router.get('/login',(req,res) =>{
		res.render("users/login");
	});
		
	router.get('/register',(req,res) =>{
		res.render("users/register");
	});

// register form for post user
router.post('/register',(req,res)=>{
	let errors =[];

	if(req.body.password!=req.body.retypepassword)
		errors.push({text: 'Passwords do not matched'});
	if(req.body.password.length<4)
		errors.push({text: 'Please must be atleast 4 characters'});
	if(errors.length>0){
		res.render('users/register',{
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			retypepassword: req.body.retypepassword
		});
	}
	else{
		User.findOne({email:req.body.email})
		.then(user =>{
			if(user){
				req.flash('error_msg','Email already Exists');
				res.redirect('/users/register');
				}
				else{
        const newUser =new User({ 
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});

		bcrypt.genSalt(10,(err, salt) =>{
			bcrypt.hash(newUser.password, salt ,(err, hash) =>{
				if(err) throw err;
				newUser.password=hash;
				newUser.save()
				.then(user =>{
					req.flash('success_msg','You are now registered');
					res.redirect('/users/login');
				})
				.catch(err =>{
					console.log(err);
					return;
				});

			});
		});
				}
		});
		

		
	}
	
});
router.get('/logout',(req,res) =>{
		req.logout();
		req.flash('success_msg','You are logged out');
		res.redirect('/users/login');
		
	});
	
module.exports = router;