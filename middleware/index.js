module.exports.roomDetails = (req, res, next) => {
    const { username, room } = req.query;
    if (username && room) {
        return next();
    }
    res.redirect('/');
}