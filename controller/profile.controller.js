const dbHelper = require('../db-helper/profilequery')

module.exports.getProfile = async (req, res) => {
    try {
        const data = await dbHelper.getProfile();
        console.log(data);
        return res.status(200).json({
            data: data.rows[0],
            error: null,
            status: "OK",
        });
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while getting the items." });
    }
}
