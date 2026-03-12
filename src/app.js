import express from 'express'
import session from 'express-session'
import kitchenwareRoutes from "./routers/kitchenware.routes.js"

//configure Express.js app
const app = express()

//view engine
app.set("view engine", "ejs")
app.set("views", "src/views")

//static directories
app.use(express.static('public'))

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
 session({
  secret: process.env.SESSION_SECRET || "dev-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
   httpOnly: true,
   maxAge: 1000 * 60 * 60 * 24
  }
 })
)

app.use((req, res, next) => {
 res.locals.user = req.session.user || null
 next()
})

//routers
app.use("/", kitchenwareRoutes)
export default app