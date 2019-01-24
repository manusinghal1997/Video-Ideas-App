const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
const methodOverride = require('method-override');
var exphbs = require('express-handlebars');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

/*app.use(function(req,res,next){
	//console.log(Date.now());
	req.name= "Manu singhal";
	next();  
});
*/

// map global promise - get rid of warning 
mongoose.Promise = global.Promise; 
// connect to mongoose
mongoose.connect('mongodb://localhost/youtube',{})
	.then(() => console.log('Mongodb Connected...'))
	.catch(err => console.log(err));


// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');
 app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get('/about',(req,res)=>{
	res.render("about");
});

// middleware for express-session
app.use(session({
	secret : 'secret',
	resave : true,
	saveUninitialized: true
}));

app.use(flash());

// global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});


// Body Parser Middle ware
 app.use(bodyParser.urlencoded({ extended: false}))
 app.use(bodyParser.json())
 
 // method-override middleware
 app.use(methodOverride('_method'));

 app.get('/',(req,res) =>{
	const title='Welcome';
	console.log("index call");
	res.render('index',{
		title: title
	});
});

app.get('/ideas/edit/:id', (req,res) =>{
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
app.put('/ideas/:id',(req,res) =>{
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

app.delete('/ideas/:id',(req,res) =>{
	Idea.remove({_id: req.params.id})
	.then(() =>{
		req.flash('success_msg','Video Idea Removed');
		res.redirect('/ideas');
	});
});
app.get('/ideas', (req,res) => {
	Idea.find({})
	.sort({date:'desc'})
	.then(ideas =>{
	res.render('ideas/index',{
		ideas: ideas
	});

	})
});	
app.get('/ideas/add',(req,res) =>{
	console.log("data=",req.body);

		res.render('add');
});

app.post('/ideas/add',(req,res) =>{
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
	
	app.listen("3000");