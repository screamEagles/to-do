const mongoose = require("mongoose");

const conn = async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://umairshakeelkhan:yMYRf6zxl3feY52O@cluster0.gxy10.mongodb.net/").then(() => {
            console.log("Connected");
        });
    } catch (error) {
        res.status(400).json({
            message: "Problem Connecting",
        });
    }
}
conn();