const express = require('express')
const Article = require ('../models/articleModel.js')
const User = require ('../models/userModel.js')
const Change = require('../models/changeModel')

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

    const change = new Change({
        location: 'storage',
        comment: 'Created new Article',
        owner: req.user._id,
        article: article._id
    })

    try {
        await article.save()
        await change.save()
        res.send('article created')
    } catch(e) {
        res.status(500).send(e.message)
    }
})

//Get user's articles?changesLimit=12
//get all articles
router.get('/articles', auth, async (req, res) => {
    if (!req.user) return res.status(403).send('Access denied')
    try{
        const articles = await Article.find({}).populate('owner', '-tokens').
        populate({
            path: 'changes',
            options: {
                limit: parseInt(req.query.changesLimit)
            }
        })
        if (!articles || articles.length == 0) return res.status(404).send('No articles found')
    
        res.send(articles)
    } catch(e) {
        res.status(500).send(e.message)
    }
    
})

//update article by admin
router.patch('/articles/update/:id', auth, async(req, res) => {

    if (!req.user || req.user.login != 'admin') {
        console.log('you are not admin')
        return res.status(403).send('Access denied')

    }
    const _id = req.params.id;
    
    const updatesList = Object.keys(req.body)
    const allowedUpdatesList = ['location','owner','name','barcode' ]

    const isValid = updatesList.every((update) => allowedUpdatesList.includes(update))

    if (!isValid) {
        return res.status(400).send('Invalid request')
    }

    try {
        const article = await Article.findById(_id)
        if (!article) return res.status(404).send('Article not found')
        updatesList.forEach((update) => {
            article[update] = req.body[update]
        })
        const newLocation = req.body.location || 'not updated'
        const change = new Change({
            location: newLocation,
            comment: 'ADMIN CHANGED ARTICLE',
            owner: req.user._id,
            article: article._id
        })
        await article.save()
        await change.save()
        res.send('Article modified')
    } catch(e) {
        res.status(500).send(e.message)
    }

})

//take articles  
router.patch('/articles/take', auth, async (req, res) => {
    const articlesId = req.body.articles;
    const newLocation = req.body.location;

    try{
        const articles = await Article.
        find().
        where('_id').
        in(articlesId).
        populate('owner', '-tokens').
        exec()

        await articles.forEach((article) => {
            if (article.location != 'storage' || article.owner.login != 'admin') {
                console.log()
                console.log('article can not be taken')
                throw new Error('Article can not be taken')
            }
        })

        await articles.forEach(async(article) => {
            article.owner = req.user._id;
            article.location = newLocation;
            await article.save()
            let change = new Change({
                location: newLocation,
                comment: 'User has taken article',
                owner: req.user._id,
                article: article._id
            })
            await change.save()
        })

        res.send(articles)

    } catch(e) {
        res.status(500).send('Unable to take elements')
    }    
})

//Return articles
//ADD CHANGES to db
router.patch('/articles/return', auth, async(req, res) => {
    if (!req.user) return res.status(403).send('Access denied')

    const articlesId = req.body.articles;
    const admin = await User.findOne({login: 'admin'})
    console.log(admin)

    try{
        const articles = await Article.
        find().
        where('_id').
        in(articlesId).
        populate('owner', '-tokens').
        exec()

        await articles.forEach((article) => {
            if (article.location == 'storage' || article.owner.login != req.user.login) {
                console.log()
                console.log('article can not be returned')
                throw new Error('Article can not be returned')
            }
        })

        await articles.forEach(async(article) => {
            article.owner = admin._id;
            article.location = 'storage';
            await article.save()
            let change = new Change({
                location: 'storage',
                comment: 'User has returned article',
                owner: req.user._id,
                article: article._id
            })
            await change.save()
        })

        res.send(articles)

    } catch(e) {
        res.status(500).send('Unable to return elements')
    }    
})

module.exports = router;