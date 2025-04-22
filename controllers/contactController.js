import Contact from "../models/contactModel.js";
import { contactValidationSchema } from "../validations/contact.js";

export const CreateContact = async (req, res) => {
  const { name, phone, email, message } = req.body;
  try {
    const parsed = contactValidationSchema.safeParse({
      name,
      phone,
      email,
      message,
    });
    if (!parsed.success) {
      console.error("contact validation failed", parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const contact = new Contact({
      name,
      phone,
      email,
      message,
    });
    const saveContact = await contact.save();
    res.status(200).json({
      message: "contact created successfully",
      contact: saveContact,
    });
  } catch (error) {
    console.error("Error in create contact", error);
    res.status(500).json({ error: "Error in create contact" });
  }
};

export const GetAllContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const isSearch = !!search.trim();
    const matchStage = isSearch
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          message: 1,
          createdAt: 1,
        },
      },
    ];

    if (!isSearch) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const contacts = await Contact.aggregate(pipeline);
    const totalContacts = await Contact.countDocuments(matchStage);

    const response = {
      total: totalContacts,
      page,
      contacts,
    };

    if (!isSearch) {
      response.totalPages = Math.ceil(totalContacts / limit);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getting contacts:", error);
    res.status(500).json({
      error: "Failed to fetch contacts. Please try again later.",
    });
  }
};

export const DeleteContact = async (req, res) => {
    const {role}  = req.user;
    const {id} = req.params;
    if (role !== "admin") {
        return res.status(403).json({
            error:"Access denied."
        })
    }
    try {
        const delteContact = await Contact.findByIdAndDelete(id);
        if (!delteContact) {
            return res.status(404).json({error:"Contact not found"})
        }
        res.status(200).json({
            message:"Contact deleted successfully",
            contact:delteContact
        })
    } catch (error) {
        console.error("Error",error);
        res.status(500).json({error:"Failed to delete contact"})
    }
};
