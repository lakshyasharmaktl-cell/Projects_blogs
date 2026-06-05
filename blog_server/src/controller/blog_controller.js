import blog_models from "../models/blog_models.js"
import register_models from "../models/register_models.js"
import { userotpsend } from "../nodemailer/mail.js"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { validname,validpassword } from '../validation/validation.js'
import jwt from 'jsonwebtoken'


dotenv.config()

// CREATE BLOG
export const register = async (req, res) => {
    try {
        const data = req.body
        const { email } = data

        const randomotp = Math.floor(1000 + Math.random() * 9000)

        const expiryTime = Date.now() + 5 * 60 * 1000;

        const checkuser = await register_models.findOneAndUpdate({ email: email },
            { $set: 
                { 'user.userotp': randomotp, 'user.otpExpire': expiryTime } }
        )

        if (checkuser) {
            const { isverify, isDelete } = checkuser.user    

            if (isDelete) return res.status(200).send({ status: true, msg: "Your Account is delete" })
            if (isverify) return res.status(200).send({ status: true, msg: "Account verify . Pls login this account" })

            if (!isverify) {
                userotpsend(checkuser.email, checkuser.name, randomotp)
                return res.status(200).send({ status: true, msg: "resend otp pls...", id: checkuser._id, name: checkuser.name, email: checkuser.email })
            }
        }
        
        data.user = { otpExpire: expiryTime, userotp: randomotp }

        const DB = await register_models.create(data)
        userotpsend(data.email, data.name, randomotp)

        return res.status(201).send({
            status: true, msg: "Successful create user",
            id: DB._id, name: DB.name, email: DB.email
        })

    }
    catch (error) { console.log(error.message)}
}

export const verify_otp = async (req, res) => {
    try {

        const { id } = req.params;
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ status: false, msg: "Pls provide otp" })
        }

        const user = await register_models.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, mmsg: "user not found" })
        }

        const { userotp, otpExpire, isverify } = user?.user;

        if (isverify) {
            return res.status(409).json({ status: false, msg: "Accont is already verified . pls login..." })
        }

        if (Date.now() > otpExpire) { 
            return res.status(410).json({ status: false, msg: "Otp has a expired . Pls req a new otp.." })
        }

        if (String(otp) != String(userotp)) {
            return res.status(401).json({ status: false, msg: "Invalid OTP" }) 
        }

        await register_models.findOneAndUpdate({ _id: id },
            { $set: { 'user.isVerify': true, 'user.userOtp': null, 'user.otpExpire': null } },
        )

        return res.status(200).json({ status: true, msg: "Account verified successfully. pls login." });

    }
    catch (error) {
        console.log(error.message)
    }
}

export const user_login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email) return res.status(400).send({ status: false, msg: "Email is required..." })
        if (!password) return res.status(400).send({ status: false, msg: "password is required..." })

        const checkuser = await register_models.findOne({ email: email, 'user.isDelete': false, })
        if (!checkuser) return res.status(404).send({ status: false, msg: "user not found . pls sign up your account" })

        if (!(checkuser.user.isVerify)) return res.status(400).send({ status: false, msg: "Account not Verify pls Verify Otp" })

        const comparepass = await bcrypt.compare(password, checkuser.password)

        if (!comparepass) return res.status(400).send({ status: false, msg: "wrong password" })

        const token = await jwt.sign({ id: checkuser._id }, process.env.JWT_token, { expiresIn: process.env.Expire_id })
        const DB = {
            name: checkuser.name,
            email: checkuser.email,
            id: checkuser._id,
            token

        }

        res.status(200).send({ status: true, msg: "login successfully", token, DB })
    }

    catch (error) { console.log(error.message)}
        
    
};

export const create_blogs = async (req, res) => {
  try {
    const data = req.body;

    const { title, body, authorId, category } = data;

    if (!title || !body || !authorId || !category) {
      return res.status(400).json({ status: false, msg: "Required fields missing" });
    }

    // check author exists
    const author = await blog_models.findById(authorId);
    if (!author) {
      return res.status(404).json({ status: false, msg: "Author not found" });
    }

    const blog = await Blog.create(data); 

    return res.status(201).json({ status: true,data: blog,
    });

  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

export const get_all_blog = async (req, res) => {
try {

        const blogs = await blog_models.find({
            isDeleted: false
        }).populate("authorId", "name email")

        if (blogs.length === 0) {
            return res.status(404).send({
                status: false,
                msg: "No blogs found"
            })
        }

        return res.status(200).send({
            status: true,
            totalBlogs: blogs.length,
            data: blogs
        })

    }

    catch (error) {

        return res.status(500).send({
            status: false,
            msg: "Server Error",
            error: error.message
        })
    }
}

export const Updated_blogs = async (req, res) => {

    try {

        const blogId = req.params.blogId
        const data = req.body

        const updatedBlog = await blog_models.findOneAndUpdate(

            {
                _id: blogId,
                isDeleted: false
            },

            data,

            {
                new: true
            }
        )

        if (!updatedBlog) {
            return res.status(404).send({
                status: false,
                msg: "Blog not found"
            })
        }

        return res.status(200).send({
            status: true,
            msg: "Blog updated successfully",
            data: updatedBlog
        })

    }

    catch (error) {

        return res.status(500).send({
            status: false,
            msg: "Server Error",
            error: error.message
        })
    }
}

export const Deleted_blogs = async (req, res) => {

    try {

        const blogId = req.params.blogId

        const deletedBlog = await blog_models.findOneAndUpdate(

            {
                _id: blogId,
            },

            {
                isDeleted: true,
                deletedAt: new Date()
            },

            {
                new: true
            }
        )

        if (!deletedBlog) {
            return res.status(404).send({
                status: false,
                msg: "Blog not found"
            })
        }

        return res.status(200).send({  status: true, msg: "Blog deleted successfully"
        })

    }

    catch (error) {

        return res.status(400).send({ status: false,msg: "Server Error", error: error.message
        })
    }
}