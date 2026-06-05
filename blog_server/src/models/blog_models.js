import mongoose from 'mongoose'

export const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },

    body: {
        type: String,
        required: true,
    },

    thumbnail: {
        type: String,
        default: "",
    },

    tags: {
        type: [String],
        default: [],
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true,
    },

    // publish system
    isPublished: {
        type: Boolean,
        default: false,
    },

    publishedAt: {
        type: Date,
    },

    // soft delete
    isDeleted: {
        type: Boolean,
        default: false,
    },

    deletedAt: {
        type: Date,
    },

    // views
    views: {
        type: Number,
        default: 0,
    },

    // likes
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    }],

    // verification system
    verification: {

        isVerified: {
            type: Boolean,
            default: false,
        },

        otp: {
            type: Number,
        },

        otpExpire: {
            type: Date,
        },

        verifiedAt: {
            type: Date,
        }
    },

}, {
    timestamps: true,
})

export default mongoose.model("Blog", blogSchema)