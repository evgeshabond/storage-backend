const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    

    try {
      const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = await jwt.verify(token, 'secretKey');
        const user = await User.findOne({'_id': decoded._id, 'tokens.token': token});
        
        if (!user) throw new Error('User not found');
        req.user = user;
        req.token = token;
      } catch(err) {
        console.log(err)
        console.log('wrong token')
      }
    next()
}

module.exports = auth;