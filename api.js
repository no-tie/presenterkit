const { createServer } = require('http')
const { MongoClient } = require('mongodb')

const express = require('express')
const Datastore = require('@seald-io/nedb')
const path = require('path')
const cors = require('cors')

require('dotenv/config')



// MARK: Express

const app = express()
const server = createServer(app)



// MARK: NeDB

const db = {}
db.events = new Datastore()



// MARK: Exports

module.exports = { db, server }



// MARK: Middlewares

app.use(cors())
app.use(express.json())



// MARK: Server

let DB

const connectDB = async () => {
    const client = new MongoClient(process.env.DB_CONNECT)
    await client.connect()
    DB = client.db('presenterkit')
}


(async () => await connectDB().then(() => {
    console.log('Connected to MongoDB')
    server.listen(process.env.PORT, '0.0.0.0', () => console.log(`\x1b[33mApp running on 🔥 PORT: ${process.env.PORT} \x1b[0m\n`))
}).catch((err) => console.log(err)))()



module.exports.collection = (c) => DB.collection(c)



// MARK: Routes

app.use('/auth', require('./routes/auth.routes'))
app.use('/event', require('./routes/event.routes'))
app.use('/user', require('./routes/user.routes'))
app.use('/slide', require('./routes/slide.routes'))


app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')))