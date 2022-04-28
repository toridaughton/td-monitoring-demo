const express = require(`express`)
const path = require('path') 
const Rollbar = require('rollbar')

const app = express()

// include and initialize the rollbar library with your access token

let rollbar = new Rollbar({
  accessToken: '0dc32ae52db249f683a9e5b3f1c0aac6',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = []

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../index.html'))
// })

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
    rollbar.info('html file served successfully.')
    rollbar.info('File served')
})


app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)

    rollbar.log('Student added successfuly', {author: "Scott", type: 'manual entry'})

    res.status(200).send(students)
})

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '../styles.css'))
    rollbar.info('css file served')
})

const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Take us to warp ${port}`))