function isLogin(req, res) {
	if (req.session.user) {
		return true;
	} else {
		//res.redirect('/login');
		//return false;
		res.send({code:-1,message:'登录过期'});
	}
}
module.exports  = isLogin;