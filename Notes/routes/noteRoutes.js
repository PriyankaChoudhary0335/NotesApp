const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/", async(req, res) => {
    try{
        const notes = await Note.find();
        res.json(notes);
    } catch (error){
      res.status(500).json({message: "Serever error"});
    }
});


router.post("/", async (req, res) =>{
    const {title,content} = req.body;
    const newNote = new Note({title,content});
    await newNote.save();
    res.status(201).json(newNote);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.json({ message: "Note deleted" });
});

module.exports = router;
