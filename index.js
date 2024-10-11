const express = require('express')
const connectToMogo = require('./model/db')
const app = express()
const port = 5000

connectToMogo()

app.get('/',(req,res) => {
    res.send('Hello World');
})

app.listen(port,() => {
    console.log(`server is running on port http://localhost:${port}`)
})