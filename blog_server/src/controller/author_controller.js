import author_models from '../models/author_models.js'


export const create_author = async (req, res) => {
    try {
        const data = req.body

        const { fname, lname, tittle, email, password } = data;

        if (!fname) return res.status(400).send({ status: false, msg: "first name is required" })
        if (!lname) return res.status(400).send({ status: false, msg: "last name name is required" })
        if (!tittle) return res.status(400).send({ status: false, msg: "tittlee  is required" })
        if (!email) return res.status(400).send({ status: false, msg: "email  is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password  is required" })

        const author = await author_models.create(data);
        return res.status(200).send({ status: true, msg: "successfully create author ...", data: author })

        console.log("okk")

    }

    catch (err) {
        res.status(400).send({ status: false, msg: err.message })
    }
}