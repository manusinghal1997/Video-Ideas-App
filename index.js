const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
// It is used for put and delete operations 
const methodOverride = require('method-override');
// handlebars template engine
var exphbs = require('express-handlebars');
const app = express();
const passport = require('passport');
// for flash messages
const flash = require('connect-flash');
//flash messages are to be stored in express-session memory
const session = require('express-session');

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

const db = require('./config/database');
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
// to connect with mlab add username and password
// mongodb://<dbuser>:<dbpassword>@ds211865.mlab.com:11865/video-idea-app
mongoose.connect(db.mongoURI,{
		useMongoClient: true
})
	.then(() => console.log('!Mongodb Connected...'))
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

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// flash message middleware
app.use(flash());  

// global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
// check user identity using user object  
	res.locals.user = req.user || null;
	next();
});


// Body Parser Middle ware
 app.use(bodyParser.urlencoded({ extended: false}))
 app.use(bodyParser.json())
 
 // method-override middleware
 app.use(methodOverride('_method'));

 app.get('/',(req,res) =>{
	const title='Welcome';
	res.render('index',{
		title: title
	});
});


// user routes
// anything that goes to /ideas pretends to that ideas file
app.use('/ideas',ideas);
// anything that goes to /users pretends to that users file
app.use('/users',users);

// Defining the port to be used
const port = process.env.PORT || 3000;


	app.listen(port,()=>{
		console.log('Server started on port ${port}');
	});