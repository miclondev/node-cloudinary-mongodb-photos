module.exports = (err, req, res, next) => {
    consolelog(err)
    res.send(err)
}