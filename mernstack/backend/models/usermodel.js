const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        required: [true, 'Please enter your name'],
        max: 32,
    },
     email:{
        type: String,
        trim: true,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [ /\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please enter your password'],
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,}$/, 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'],
    

        
    },
    role: {
        type: String,
        default: 0

}
}, {timestamp: true} )


//encrypted password before saving to database for signup
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)


})
//verified password with bcrypt for login
userSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.password)
}
// generate token for login
userSchema.methods.jwtGenerateToken = async function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN})
}


module.exports = mongoose.model('User', userSchema)


