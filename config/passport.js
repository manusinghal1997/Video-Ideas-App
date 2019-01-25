const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user model
const User = mongoose.model('users');


module.exports = function (passport) {
	// body...
passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done) =>{
	console.log(email);
	User.findOne({
		email: email
	}).then(user =>{

// Check User exists or not
	if(!user){
		return done(null,false,{message: 'No user found'});
		}

	// Matches the password
	bcrypt.compare(password,user.password,(err , isMatch)=>{
		if(err) throw err;
		if(isMatch)
			return done(null,user);
		else{
			return done(null,false,{ message: 'Password Incorrect'});
		}
	});
	})
}));
passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
	done(err,user);
});
});


}
