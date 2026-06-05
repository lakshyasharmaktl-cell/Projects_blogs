import express from 'express'
import {create_author} from '../controller/author_controller.js'
import {create_blogs,get_all_blog,Updated_blogs,Deleted_blogs,register,verify_otp,user_login} from '../controller/blog_controller.js'

const routes = express.Router()

//author
routes.post('/create_author',create_author)

//blogs
routes.post('/create_blogs',create_blogs)
routes.post('/register',register)
routes.post('/verify_otp/:id',verify_otp)
routes.post('/user_login',user_login)
routes.post('/get_all_blog',get_all_blog)
routes.put('/Updated_blogs',Updated_blogs)
routes.delete('/Deleted_blogs',Deleted_blogs)


export default routes