const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const {body , validationResult} = require('express-validator');

/* ROUTE 1: get all notes using GET method /api/auth/fetchallnotes */
router.get('/fetchallnotes',fetchuser, async(req,res) => {
   try{
    const notes = await Note.find({user:req.user.id});
    res.json(notes)
   } 
   catch(error){
    console.log(error.message);
    res.status(500).send('Internal Server Error')
  }
})

/* ROUTE 2: add new nots using PSOT method /api/auth/addnote */
router.post('/addnote',fetchuser, [
    body('title','Enter valid title').isLength({min:3}),
    body('description','Description must be atleast 5 character').isLength({min:5})
], async(req,res) => { 
   try{
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const note = new Note({
        title, description ,tag, user:req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote)
   }
   catch(error){
    console.log(error.message);
    res.status(500).send('Internal Server Error')
}
 })

 /*ROUTE 3: update exiting note using PUT /api/auth/updatenote */
 router.put('/updatenote/:id',fetchuser, [
    body('title','Enter valid title').isLength({min:3}),
    body('description','Description must be atleast 5 character').isLength({min:5})
], async(req,res) => { 
   try{
         const {title,description,tag} = req.body;
         /* create new object as per users updation request */
        const newNote = {}
        if(title){
            newNote.title = title
        }
        if(description){
            newNote.description = description
        }
        if(tag){
            newNote.tag = tag
        }
        /*find the note to be updated and update it */
        let note = await Note.findById(req.params.id);
        if(!note){
           return res.status(404).send("Not Found ...")
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed ...")
        }

        note = await Note.findByIdAndUpdate(req.params.id , {$set:newNote}, {new:true})
        res.status(200).send(note)
   }
   catch(error){
    console.log(error.message);
    res.status(500).send('Internal Server Error')
}
 })

/*ROUTE 4: delete exiting note using DELETE /api/auth/deletenote */
router.delete('/deletenote/:id',fetchuser, async(req,res) => { 
   try{
        /*find the note to be deleted and delete it */
        let note = await Note.findById(req.params.id);
        if(!note){
           return res.status(404).send("Not Found ...")
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed ...")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({"Success":'Note deleted successfully...',note:note})
   }
   catch(error){
    console.log(error.message);
    res.status(500).send('Internal Server Error')
}
 })


module.exports = router