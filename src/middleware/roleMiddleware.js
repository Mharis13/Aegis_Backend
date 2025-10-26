exports.onlyAdmin = (req, res, next) => {

    if ( req.user.role === 'admin') {
        console.log(req.user.role)
        return next();
    }
    return res.status(403).json({message: 'Access denied. Admins only.'});

}