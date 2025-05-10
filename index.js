const express = require('express')
const cors = require('cors')
const pbRouter = require('./routes/pbRouter')
require('dotenv').config()

const app = express()

app.options('*', cors())
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use('/api', pbRouter)

const connection = async () => {
    try {
        app.listen(process.env.PORT, '0.0.0.0', () => console.log(`server started on PORT: ${process.env.PORT}`))
    } catch (error) {
        console.log(error.message)
    }
}

connection()