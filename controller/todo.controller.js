const dbHelper = require("../db-helper/todoqueries");

// GET ITEMS
module.exports.getItems = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const values = await dbHelper.getAllItems(page, limit);

    if (search !== undefined) {
      const data = values.rows.filter((val) => {
        return val.value.toLowerCase().includes(search.toLowerCase());
      });
      return res.status(200).json({
        data: { count: data.length, items: data },
        error: null,
        status: "OK",
      });
    }

    return res.status(200).json({
      data: { count: values.count, items: values.rows },
      error: null,
      status: "OK",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while getting the items.");
  }
};

// GET SPECIFIC ITEMS
module.exports.getSpecificItem = async (req, res) => {
  try {
    const { id } = req.params;
    const value = await dbHelper.getSpecificItem(id);
    return res.status(200).json({
      data: { count: value.count, items: value.rows },
      error: null,
      status: "OK",
    });
  } catch (err) {
    return res
      .status(500)
      .josn({ error: `An error occurred while getting the item.` });
  }
};

// POST ITEM or ITEMS
module.exports.postItem = async (req, res) => {
  try {
    // Request body should be an array
    if (!Array.isArray(req.body.value)) {
      return res
        .status(400)
        .json({ error: "Value should be an array of strings" });
    }

    await dbHelper.postItem(req.body?.value);
    return res
      .status(201)
      .json({ message: `Item added successfully`, error: null, status: "OK" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: `An error occurred while adding the item.` });
  }
};

// UPDATE ITEM
module.exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (value) {
      await dbHelper.updateItem(req.params.id, req.body.value);

      res.status(200).json({
        message: `Item with ID ${id} updated successfully`,
        error: null,
        status: "OK",
      });
    } else {
      return res.status(400).json({ error: "Invalid Data" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating the item." });
  }
};

// DELETE VALUE
module.exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await dbHelper.deleteItem(id);
    return res.status(200).json({
      message: `Item with ID ${id} deleted successfully`,
      error: null,
      status: "OK",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item." });
  }
};

// DELETE MULTIPLE ITEMS
module.exports.deleteMultipleItems = async (req, res) => {
  try {
    const ids = req.query.id.split(",").map(Number);
    await dbHelper.deleteMultipleItems(ids, res);

    res.json({
      message: `Items with IDs ${ids.join(", ")} deleted successfully`,
      error: null,
      status: "OK",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting items", error: error.message });
  }
};

// DELETE ALL ITEMS
module.exports.deleteAllItems = async (req, res) => {
  try {
    const value = await dbHelper.deleteAllItems();

    res.json({
      message: value.message,
      error: null,
      status: "OK",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting items", error: err });
  }
}