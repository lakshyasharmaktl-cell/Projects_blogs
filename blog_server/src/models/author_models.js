import mongoose from 'mongoose'

export const authorSchema = new mongoose.Schema({
    name: {
        type: String, trim: true, required: true
    },

    fname: {
        type: String, required: true, trim: true,
    },

    lname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, trim: true, required: true, lowercase: true, unique: true
    },
    tittle: {
        type: String, enum: ['Mr', 'Mrs', 'Miss'], trim: true, required: true
    },

    profileImg: {
        type: String,
        default: ''
    },

    password: {
        type: String, trim: true, required: true

    },

    user: {
        isDelete: { type: Boolean, default: false },
        isVerify: { type: Boolean, default: false },
    },
})



export default mongoose.model('author', authorSchema)