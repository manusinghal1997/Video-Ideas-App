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
// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

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


// user routes
// anything that goes to /ideas pretends to that ideas file
app.use('/ideas',ideas);
app.use('/users',users);

	app.listen("3000");