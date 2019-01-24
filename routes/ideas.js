const express= require('express');
const router = express.Router();
require('../models/Idea');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/youtube',{})
	.then(() => console.log('Mongodb Connected...'))
	.catch(err => console.log(err));

// In this file we are not having access to app so we are changing
// app to router.
const Idea = mongoose.model('ideas');

router.get('/edit/:id', (req,res) =>{
		Idea.findOne({
			_id: req.params.id
		})
		.then(idea =>{
			res.render('ideas/edit',{
				idea : idea
			});
		});
	
});
 
// edit form process
// to use put method we have to use method-override
router.put('/:id',(req,res) =>{
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea =>{
		idea.title = req.body.title;
		idea.details = req.body.details;
		console.log(idea);
		idea.save()
		.then(idea =>{
				req.flash('success_msg','Video Idea Updated');
	
			res.redirect('/ideas')
		})	
	});
});

router.delete('/:id',(req,res) =>{
	Idea.remove({_id: req.params.id})
	.then(() =>{
		req.flash('success_msg','Video Idea Removed');
		res.redirect('/ideas');
	});
});
router.get('/', (req,res) => {
	Idea.find({})
	.sort({date:'desc'})
	.then(ideas =>{
	res.render('ideas/index',{
		ideas: ideas
	});

	})
});	
router.get('/add',(req,res) =>{
	console.log("data=",req.body);

		res.render('add');
});

router.post('/add',(req,res) =>{
	console.log(req.body);

let errors =[];

		if(!req.body.title)

			errors.push({text: 'Please add a title'});
		if(!req.body.details)
			errors.push({text: 'Please enter Details'});
		if(errors.length>0){
			res.render('add',{
				errors : errors,
				title :  req.body.title,
				details : req.body.details 
			});
		}
		else
		{
			const newUser = {
				title: req.body.title,
				details: req.body.details
			}
			new Idea(newUser)
			.save()
			.then(idea =>{
		req.flash('success_msg','Video Idea Added');
	
				res.redirect('/ideas');
			})
		}

	});


module.exports = router;