const url = require('url');

exports.isFriend = (req,res,next) => {
    const referer = req.get('Referer');
    const urlObject = url.parse(referer,true);
    const urlPath = urlObject.pathname;
    if(req.user){
        const user = req.user;
        for(const friend of user.friends){
            if(friend.username == req.params.username){
                next();
                return;
            }
        }
        res.redirect(urlPath);
    }
    else{
        res.redirect('/auth/login');
    }
}