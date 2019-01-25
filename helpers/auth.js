module.exports={
	ensureAuthenticated: function (req,res,next) {
		// body...
		if(req.isAuthenticated()){
			return next();
		}
		req.flash('error_msg','Not Authorised');
		res.redirect('/users/login')
	}
}