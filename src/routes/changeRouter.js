const express = require('express')
const Article = require ('../models/articleModel.js')
const User = require ('../models/userModel.js')

const auth = require('../middleware/auth')
const Change = require('../models/changeModel.js')

const router = express.Router()

//Get all changes
router.get('/changes', auth, async(req, res) => {
    if (!req.user || req.user.login != 'admin') {
        return res.status(403).send('Access denied')
    }
    try{
        const changes = await Change.find({}).
        populate('owner', '-tokens').
        populate('article')
        res.send(changes)
    }catch(e) {
        res.status(500).send(e.message)
    }
    

})


module.exports = router;