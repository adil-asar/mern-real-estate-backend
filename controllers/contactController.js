import Contact from "../models/contactModel.js";

export const CreateContact = (req, res) => {
    console.log("this is contact constroller for frontend side")
    res.send("this is contact constroller for frontend side")
 };


 export const GetAllContacts = (req,res)=>{
 console.log("this is get all controller for admin side ")
 res.send("this is get all controller for admin side ")
 }


 export const DeleteContact = (req,res)=>{
console.log("this is delete controller for admin side ")
res.send("this is delete controller for admin side ")
 }


