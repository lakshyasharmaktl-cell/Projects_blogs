export const create_blogs=(req,res)=>{
    try{
        const data = req.body

        const blog = await Blog .create(data);
        return res.status(200).send({ status: true, msg: "successfully create bllogs ...", data: blog })
        
    }

    catch(err){
        res.status(400).send({status:false,msg:err.message}) 
    }
}