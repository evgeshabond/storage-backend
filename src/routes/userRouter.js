const express = require('express')
const User = require ('../models/userModel')
const bcryptjs = require("bcryptjs");

const auth = require('../middleware/auth')

const router = express.Router()

// Create user
router.post('/users',auth ,async (req, res) => {
    if (!req.user || req.user.login != 'admin') {
        console.log('you are not admin')
        return res.status(403).send('Access denied')

    }
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.createAuthToken()
        res.send({user, token})
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})



//Update user
router.patch('/users/me', auth, async(req, res) => {
    const updatesList = Object.keys(req.body)
    const allowedUpdatesList = ['login','password' ]

    const isValid = updatesList.every((update) => allowedUpdatesList.includes(update))

    if (!isValid) {
        return res.status(400).send('Invalid request')
    }

    try {
        updatesList.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send('User modified')
    } catch(e) {
        res.status(500).send('User is not modified')
    }

})

//Update user from admin by id
router.patch('/users/:id', auth, async(req, res) => {

    if (!req.user || req.user.login != 'admin') {
        console.log('you are not admin')
        return res.status(403).send('Access denied')

    }
    const _id = req.params.id;
    
    const updatesList = Object.keys(req.body)
    const allowedUpdatesList = ['login','password','firstName','lastName' ]

    const isValid = updatesList.every((update) => allowedUpdatesList.includes(update))

    if (!isValid) {
        return res.status(400).send('Invalid request')
    }

    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send('User not found')
        updatesList.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        res.send('User modified')
    } catch(e) {
        res.status(500).send('User is not modified')
    }

})

//User login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.login, req.body.password)
        const token = await user.createAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e.message)
    }
})

//Get all users
router.get('/users', auth, async (req, res) => {
    if (!req.user) return res.status(403).send('Access denied')
    try {
        const users = await User.find({}).
        populate('articles').exec(function (e, users) {
            users.forEach((user) => user.tokens = [])
            res.send(users)
        })

    } catch(e) {
        res.status(500).send(e.message)
    }
})

//Logout
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Successfully logged out from all devices')
    } catch(e) {
        res.status(500).send('Logout from all devices failed')
    }
})

//Get user info
router.get('/users/me', auth, async (req, res) => {
    if (!req.user) return res.status(404).send('User is not found')
    try{
        let user = req.user;
        await user.populate('articles').populate('changes').execPopulate()
        res.send(user)
    } catch(e) {
        res.status(500).send(e.message)
    }
    
    
})

module.exports = router;