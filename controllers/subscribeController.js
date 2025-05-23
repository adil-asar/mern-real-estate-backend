import Subscriber from "../models/subscribeModel.js";

export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });
    if (existingSubscriber) {
      return res.status(409).json({ error: "Email is already subscribed" });
    }
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({
      message: "Successfully subscribed to newsletter",
      subscriber: {
        id: newSubscriber._id,
        email: newSubscriber.email,
        createdAt: newSubscriber.createdAt,
      },
    });
  } catch (error) {
    console.error(" Error subscribing to newsletter:", error);
    res.status(500).json({
      error: "Something went wrong while subscribing. Please try again later.",
    });
  }
};

export const getSubscribedUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const isSearch = !!search.trim();

  try {
    const matchStage = isSearch
      ? { email: { $regex: search, $options: "i" } }
      : {};

    const totalSubscribers = await Subscriber.countDocuments(matchStage);

    // Build the pipeline
    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
    ];

    if (!isSearch) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    pipeline.push({
      $project: {
        _id: 1,
        email: 1,
        createdAt: 1,
      },
    });

    const subscribers = await Subscriber.aggregate(pipeline);

    res.status(200).json({
      total: totalSubscribers,
      page: isSearch ? 1 : page,
      totalPages: isSearch ? 1 : Math.ceil(totalSubscribers / limit),
      subscribers,
    });
  } catch (error) {
    console.error("Error in getSubscribedUsers:", error);
    res.status(500).json({
      error: "Failed to fetch subscribers. Please try again later.",
    });
  }
};


export const deleteSubscribedUsers = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied. " });
  }
  try {
    const deletedSubscriber = await Subscriber.findByIdAndDelete(id);
    if (!deletedSubscriber) {
      return res.status(404).json({ error: "Subscriber not found." });
    }
    res.status(200).json({
      message: "Subscriber deleted successfully.",
      subscriber: deletedSubscriber,
    });
  } catch (error) {
    console.error(" Error deleting subscriber:", error);
    res.status(500).json({ error: "Failed to delete subscriber." });
  }
};
