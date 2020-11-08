const express = require('express')
const Article = require ('../models/articleModel.js')

const auth = require('../middleware/auth')

const router = express.Router()

//Create Article
router.post('/articles', auth, async (req, res) => {
    if (!req.user || req.user.login != 'admin') {
        console.log('you are not admin')
        return res.status(403).send('Access denied')

    }
    
    const article = new Article({
        location: 'storage',
        owner: req.user._id,
        ...req.body
    })
    try {
        await article.save()
        res.send('article created')
    } catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;