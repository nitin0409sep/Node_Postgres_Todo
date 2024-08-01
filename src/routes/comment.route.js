const express = require("express");

//! Controllers
const {
    getComments,
    postComment,
    updateComment,
    deleteComment,
    deleteAllComments,
} = require("../controller/comments.controller");

//! Authenticate User Middleware
const { authenticateUser } = require('../middlewares/authorization.middleware');

//! Routes
const route = express.Router();

//? GET ALL COMMENTS
route.get("/view-comments", authenticateUser, (req, res, next) => {
    const id = req.query.id; // Extracts the query parameter 'id'

    if (!id)
        return res.status(400).json({ message: "Task ID parameter is required" });

    getComments(req, res, next, id);
});

//? ADD COMMENTS
route.post("/addComment", authenticateUser, (req, res, next) => {
    const id = req.query.id; // Extracts the query parameter 'id'

    if (!id)
        return res.status(400).json({ message: "Task ID parameter is required" });

    next();
},
    postComment
);

//? UPDATE COMMENTS
route.put("/updateComment", authenticateUser, (req, res, next) => {
    if (!req.query.comment_id) {
        return res.status(400).json({ message: "ID parameter is required" });
    }

    next();
},
    updateComment
);

//? DELETE COMMENT
route.delete("/deleteComment", authenticateUser, (req, res, next) => {
    if (!req.query.comment_id) {
        return res.status(400).json({ message: "ID parameter is required" });
    }

    next();
},
    deleteComment
);

//? DELETE ALL COMMENTS
route.delete("/deleteAllComments", authenticateUser, deleteAllComments);


module.exports = route;