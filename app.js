const createError = require("http-errors")
const express = require("express")
const session = require("express-session")
const path = require("path")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
const cors = require("cors")
const bodyParser = require("body-parser")
const logger = require("morgan")
const csrf = require("csurf")

require("./db")
const app = express()
const apiRouter = require("./routes/api")
const indexRouter = require("./routes/index")

const dashboardController = require("./controllers/DashboardController")

const api = createApiRouter()
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// app.use(
//     session({
//         cookie: { secure: process.env.isHttps === "true", maxAge: 36000000 },
//         saveUninitialized: false,
//         resave: false,
//         secret: "super-super-secret"
//     })
// )
app.use(
    cookieSession({
        name: "session",
        keys: ["super-super-secret"],
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
)

app.use("/api", api)
app.use(csrf({ cookie: true }))
// if (app.get("env") === "production") {
//     // Serve secure cookies, requires HTTPS
//     session.cookie.secure = true
// }

app.use(function (req, res, next) {
    var token = req.csrfToken()
    res.cookie("XSRF-TOKEN", token)
    res.locals.csrfToken = token
    next()
})

app.use("/", indexRouter)
app.use("/dashboard", dashboardController)

function createApiRouter() {
    var router = new express.Router()
    router.use("/", apiRouter)
    return router
}

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404))
// })

// error handler
// app.use(function (err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get("env") === "development" ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render("error")
// })

module.exports = app
