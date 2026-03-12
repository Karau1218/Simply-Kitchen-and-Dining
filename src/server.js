
//import dotenv from 'dotenv'
import "dotenv/config"
import app from './app.js'

//dotenv.config({ path: "./.env" }) // load .env variables

// Start server
const port = process.env.PORT || 8002
app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`)
})