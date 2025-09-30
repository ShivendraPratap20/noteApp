const userModel = require("../db/model/userModel");

const addNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userID = req.query.userID;
        const userData = await userModel.find({ userID: userID });
        if (userData[0] == undefined) {
            res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
            return;
        }
        userData[0].notes.push({ title, content, createdAt:new Date() });
        await userData[0].save();
        res.status(200).json({ status: "SUCCESS", message: "New note added" });
    } catch (error) {
        console.log(`Error while adding new note ${error}`);
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    }
};
const getNote = async (req, res) => {
    const userID = req.params.id;
    try {
        const userData = await userModel.find({ userID: userID });
        if (userData[0] == undefined) {
            res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
            return;
        }
        res.status(200).json({ status: "SUCCESS", data: userData[0].notes });
    } catch (error) {
        console.log(`Error while retrieving notes from db ${error}`);
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    }
};

const deleteNote = async (req, res) => {
    const userID = req.query.userID;
    const noteID = req.query.noteID;
    try {
        const userData = await userModel.find({ userID: userID });
        if (userData[0] == undefined) {
            res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
            return;
        }
        await userModel.updateOne(
            { userID: userID },         
            { $pull: { notes: { _id: noteID } } } 
        );
        res.status(200).json({ status: "SUCCESS", message: "Note deleted" });
    } catch (error) {
        console.log(`Error whilie deleting note ${error}`);
        res.status(500).json({ status: "FAILED", message: "Internak server error" });
    }
};


module.exports = {
    addNote,
    getNote,
    deleteNote
}