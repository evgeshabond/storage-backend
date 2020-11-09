const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

//db
require('./db/mongoose')

//middleware
const userRouter = require('./routes/userRouter')
const articleRouter = require('./routes/articleRouter')
const changeRouter = require('./routes/changeRouter')

app.use(express.json())
app.use(userRouter)
app.use(articleRouter)
app.use(changeRouter)

app.get('/', (req, res) => {
    res.send('Hello WORLD!!!!')
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})