const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
  // email, name, password, tokens
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      }
    }
  },
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  tokens: [String]
});

// var jsonToken = jwt.sign({ email: 'bar' }, process.env.SECRET);


schema.statics.loginWithCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found")
  console.log(email, password, user.password)
  const allow = await bcrypt.compare(password.toString(), user.password)
  if (!allow) throw new Error("Password not correct")

  return user
}

schema.methods.generateToken = async function () {
  const jsonToken = jwt.sign({ email: this.email, id: this._id }, process.env.SECRET);
  // save token into database
  this.tokens.push(jsonToken);
  await this.save();
  return jsonToken
}

schema.methods.toJSON = function () {
  console.log(this)
  let newObj = this.toObject();
  delete newObj.password;
  delete newObj.__v
  return newObj
}

schema.pre("save", async function (next) {
  // this.password = $2b$10$hwN3dQa25F1Kh354WBnV2uHhPbNDi62ONgh21NzH9XcuJEl3n1GCi
  console.log(this.isModified("password")) // this.password
  // check again the logic 
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
})


const User = mongoose.model('User', schema);



module.exports = User