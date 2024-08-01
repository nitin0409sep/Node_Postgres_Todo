module.exports.getProfile = async (req, res) => {
    try {
        const { user_name, email } = req.user;
        return res.status(200).json({
            user: { user_name, email },
            error: null,
            status: "OK",
        });
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while getting the items." });
    }
}
