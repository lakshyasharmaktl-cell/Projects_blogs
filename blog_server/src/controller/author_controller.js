export const create_author = (req, res) => {
    try {
        const data = req.body

        const author = await Author.create(data);
        return res.status(200).send({ status: true, msg: "successfully create author ...", data: author })

    }

    catch (err) {
        res.status(400).send({ status: false, msg: err.message })
    }
}