const express = require(`express`)
const path = require('path') 
const Rollbar = require('rollbar')

const app = express()
app.use(express.json())

// include and initialize the rollbar library with your access token

let rollbar = new Rollbar({
  accessToken: '0dc32ae52db249f683a9e5b3f1c0aac6',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = []


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
    rollbar.info('html file served successfully.')
    rollbar.info('File served')
})


app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex(studentName=> studentName === name)

    if(index === -1 && name !== ''){
        students.push(name)
        rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})
        res.status(200).send(students)
    } else if (name === ''){
        rollbar.error('No name given')
        res.status(400).send('must provide a name.')
    } else {
        rollbar.error('student already exists')
        res.status(400).send('that student already exists')
    }

})

app.get('/style', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/styles.css'))
    rollbar.info('css file served')
})

const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Take us to warp ${port}`))