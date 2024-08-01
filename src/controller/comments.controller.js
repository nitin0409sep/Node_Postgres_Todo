const dbHelper = require('../database/db-helper/commentsquery')

//? GET ALL COMMENTS
module.exports.getComments = async (req, res, next, id) => {
    try {
        const user_id = req.user.unique_id;
        const task_id = id;

        // GET DATA FROM DATABASE
        const values = await dbHelper.getAllComments(user_id, task_id);

        return res.status(200).json({
            data: { comments: values.rows },
            error: null,
            status: "OK",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error occurred while getting the comments.");
    }
};

//? POST COMMENT
module.exports.postComment = async (req, res) => {
    try {
        const id = req.query.comment_id;
        const { comment } = req.body;

        // Check if any of the required fields are missing
        if (!comment) {
            return res.status(400).json({ error: `Comment can't be empty!` });
        }

        const user_id = req.user.unique_id;
        const task_id = id;

        await dbHelper.postComment(user_id, task_id, req.body.comment);

        return res
            .status(201)
            .json({ message: `Comment added successfully`, error: null, status: "OK" });
    } catch (error) {
        return res
            .status(500)
            .send({ error: `An error occurred while adding the comment.` });
    }
};

//? UPDATE COMMENT
module.exports.updateComment = async (req, res) => {
    try {
        const { comment_id, id } = req.query;
        const { comment } = req.body;

        console.log(comment_id, id);

        // Check if any of the required fields are missing
        if (!comment) {
            return res.status(400).json({ error: `Comment can't be empty!` });
        }

        const task_id = id;

        const result = await dbHelper.updateComment(task_id, comment_id, req.body.comment);

        return result.success ? res.status(200).json({
            message: result.message,
            error: null,
            status: "OK",
        })
            : res.status(400).json({
                error: result.message,
            });
    } catch (error) {
        return res
            .status(500)
            .send({ error: `An error occurred while adding the comment.` });
    }
};

//? DELETE COMMENT
module.exports.deleteComment = async (req, res) => {
    try {
        const { id, comment_id } = req.query;
        const user_id = req.user.unique_id;

        const result = await dbHelper.deleteComment(user_id, id, comment_id);

        if (result.success) {
            return res.status(200).json({
                message: result.message,
                error: null,
                status: "OK",
            });
        } else {
            return res.status(404).json({
                error: result.message,
                status: "Not Found",
            });
        }

    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item." });
    }
};

//? DELETE ALL COMMENTS
module.exports.deleteAllComments = async (req, res) => {
    try {
        const user_id = req.user.unique_id;
        const { id } = req.query;

        const result = await dbHelper.deleteAllComments(user_id, id);

        if (result.success) {
            return res.status(200).json({
                message: result.message,
                error: null,
                status: "OK",
            });
        } else {
            return res.status(404).json({
                error: result.message,
                status: "Not Found",
            });
        }

    } catch (err) {
        res
            .status(500)
            .json({ error: err.message });
    }
};
