exports.isFriend = (req,res,next) => {
    if(req.user){
        const user = req.user;
        for(const friend of user.friends){
            if(friend.username == req.params.username){
                next();
                return;
            }
        }
        res.redirect('/profile/' + req.params.username);
    }
    else{
        res.redirect('/auth/login');
    }
}