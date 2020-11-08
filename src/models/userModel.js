const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { Timestamp } = require('mongodb');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required:true,
        trim:true
    },
    lastName: {
        type: String,
        required:true,
        trim:true
    },
    tokens: [{ token: {type: String, required: true}}]
},
{
    timestamps: true,
})

userSchema.virtual('articles', {
    ref: 'article',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('changes', {
    ref: 'change',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.createAuthToken = async function() {
    try {
        const token = await jwt.sign({ _id: this._id}, "secretKey")
        this.tokens = [...this.tokens, {token}]
        this.save()
        return token;
    } catch(e) {
        return e;
    }
}

userSchema.statics.findByCredentials = async function (login, password) {
    try {
      const user = await User.findOne({ login });
      if (!user) {
        throw new Error("Unable to login - no user with this login");
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Unable to login");
      }
      return user;
    } catch (e) {
      return e.message;
    }
  };

  userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcryptjs.hash(this.password, 8);
    }
    next();
  });

  const User = mongoose.model("User", userSchema);

  module.exports = User;
  

