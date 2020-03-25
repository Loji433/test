const mongoose = require('mongoose')
const bcrypt = require("bcrypt")//تشفير كلمة المرور
const salt = 10;// عدد العمليات الحسابية


const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,//لجعله أمر ضروري اي يجب ان يدخل لسم المستخدم
        // minlength: [
        //   3,
        //   "Aha! you are not real! First Name must be more than 3 characters"
        // ],
        // maxlength: [99, "This is too much man!!! chill!!"]
      },
      lastname: {
        type: String,
        required: true,
        // minlength: [
        //   3,
        //   "Aha! you are not real! Last Name must be more than 3 characters"
        // ],
        // maxlength: [99, "This is too much man!!! chill!!"]
      },
      email:{
          type:String,
          required: true,
          lowercase: true,
          unique: true
      },
      password:{
          type:String,
          required: true,
          // minlength: [6, "Khalas your password is too weak"]
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      isSuperUser:{
      type: Boolean,
      default: false
      },
      userType:{
        type: String,
        enum: ['admin', 'regula', 'superadmin'],
        default: "admin"
      }
    },
    { timestamps: true }
    );

  userSchema.pre('save', function(next){
    //The specific user that you're saving
    let user= this;
    if (!user.isModified("password")){
        return next();
    } 
    // else {
    //     user.password= bcrypt.hashSync(user.password, salt)
    //     next();
    // }

    let hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
})

  userSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password)
  }
    // let hash = bcrypt.hashSync(req.body.password, salt);
    // console.log(hash)

const User = mongoose.model('User', userSchema)
module.exports = User
