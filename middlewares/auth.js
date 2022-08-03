const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect("/login")
    }
}

const noAuthMiddleware = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/dashboard")
    }
}

module.exports = { authMiddleware, noAuthMiddleware }
