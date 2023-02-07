const User = require('../models/usermodel')
const ErrorResponse = require('../utills/errorResponse')


exports.signup = async(req, res, next) => {
    const {email} = req.body
    const userExists  = await User.findOne({email})
    if(userExists){
        return res.status(400).json({
            success: false,
            Messages:'Email is taken'
        })

    } 
    try{
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })

    } catch(err){
        console.log(err)
        res.status(400).json({
            success: false, 
            Messages: err.message})
    }
}

exports.signin = async(req, res, next) => {
    
    try{
        const {email, password} = req.body
         if (!email || !password){
            return res.status(400).json({
                success: false,
                Messages: 'Please provide email and password'

            })
        }
        //check if user exists in database
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                Messages: 'Invalid Credentials'
            })
        }
        //verify password with bcrypt
        const isMatched = await user.comparePassword(password)
        if(!isMatched){
            return res.status(400).json({
                success: false,
                Messages: 'Invalid Credentials'
            })
        }
        
        
     generateToken(user, 200, res);

    }catch(err){
        console.log(err)
        res.status(400).json({
            success: false,
            Messages: "You can not sign in please try again"
        })
    }
}

const generateToken = async(user, statusCode, res) => {
    const token = await user.jwtGenerateToken();
    const options = {
        httpOnly: true,
        expire: new Date(Date.now() + process.env.EXPIRE_TOKEN)
};
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({success: true, token})

};

exports.logout = async(req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        Messages: 'You are logged out'
    })

}

exports.singleUser = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })

    } catch(err){
        next(new ErrorResponse(`User with id ${req.params.id} is not found`, 404))
    }
}
