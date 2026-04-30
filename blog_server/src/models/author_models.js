import mongoose from 'mongoose'

export const authorSchema  = new mongoose.Schema({
    name: {
        type: String, trim: true, required:true
    },
    email: {
        type: String, trim: true, required: true,  lowercase: true , unique:true
    },
    tittle: {
        type: String, enum: ['Mr', 'Mrs', 'Miss'], trim: true, required: true
    },
    role: {
        type: String, enum: ['user', 'admin'], trim: true, required: true
    },
    profileImg: {
        type: String,
        default: ''
    },

    password: {
        type: String, trim: true, required: [true, 'password is required'],
        validate: [validpassword, 'Invalid password . Please give one lowercase and one uppercase letter with one special character and one number']

    },

    user: {
        isDelete: { type: Boolean, default: false },
        otpExpire: { type: Number, default: 0 },
        isVerify: { type: Boolean, default: false },
        userotp: { type: Number, default: null, trim: true },
    },
})

userSchema.pre('save', async function () {
    if(this.profileImg){
        this.profileImg = await uploadProfileImg(this.profileImg.path)
    }
    this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model('usedsrs', userSchema)