const express = require('express')
const dotenv = require('dotenv').config()
mongoose =require('mongoose')
const userRoute = require('./routes/user')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')


const app = express()

// Connect to DB
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASESTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log('DB connected')
}).catch((err) => {
    console.log(err)
})

app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.json())

// Routes middleware
app.use('/api', userRoute)

// Error handler
app.use(errorHandler)

const port = process.env.port || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})