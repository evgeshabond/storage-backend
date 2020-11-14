const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cors = require('cors')

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


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });


app.get('/',  (req, res) => {
    console.log('got request')
    res.send('HI')
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})