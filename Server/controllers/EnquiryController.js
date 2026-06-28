const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


exports.sendEnquiry = async (req, res) => {

    const property = await Property.findById(
        req.params.propertyId
    ).populate("owner");

    if (!property) {
        return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner && property.owner._id.toString() === req.user.id.toString()) {
        return res.status(400).json({ message: "You cannot contact yourself about your own property" });
    }

    // Fetch the buyer's full info so we can use their email as Reply-To
    const buyer = await User.findById(req.user.id);

    const enquiry = await Enquiry.create({
        property: property._id,
        owner: property.owner._id,
        seeker: req.user.id,
        message: req.body.message
    });

    // Increment inquiries count
    await Property.findByIdAndUpdate(property._id, { $inc: { inquiriesCount: 1 } });

    const buyerName = buyer ? (buyer.name || buyer.email) : "A potential buyer";
    const propertyTitle = property.title || "a property";

    // Build a clear property details block
    const priceFormatted = property.price
        ? `${property.price.toLocaleString()} EGP ${property.priceType === "rent" ? "/ month" : "(for sale"}`
        : "N/A";

    const propertyDetails =
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🏠 PROPERTY DETAILS\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Title    : ${property.title || "N/A"}\n` +
        `Type     : ${property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : "N/A"}\n` +
        `Price    : ${priceFormatted}\n` +
        `Location : ${property.location || "Not specified"}\n` +
        `Bedrooms : ${property.bedrooms ?? "N/A"}\n` +
        `Bathrooms: ${property.bathrooms ?? "N/A"}\n` +
        `Area     : ${property.area ? property.area + " m²" : "N/A"}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const emailBody =
        `Hi ${property.owner.name || "there"},\n\n` +
        `You have received a new enquiry on Makany!\n\n` +
        `${propertyDetails}\n\n` +
        `👤 FROM BUYER\n` +
        `Name : ${buyerName}\n` +
        `Email: ${buyer ? buyer.email : "unknown"}\n\n` +
        `💬 MESSAGE\n` +
        `${req.body.message}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `To reply directly to the buyer, simply hit Reply on this email.\n` +
        `This message was sent via Makany.`;

    // replyTo is set to the buyer's email so the owner's reply goes directly to them
    await sendEmail(
        property.owner.email,
        `New Enquiry from ${buyerName} – ${propertyTitle}`,
        emailBody,
        buyer ? buyer.email : null
    );

    res.status(201).json(enquiry);
};


exports.ownerEnquiries = async (req,res)=>{

    const enquiries = await Enquiry.find({
        owner:req.user.id
    })
    .populate("property")
    .populate("seeker");

    res.json(enquiries);
};


exports.seekerEnquiries = async (req,res)=>{

    const enquiries = await Enquiry.find({
        seeker:req.user.id
    })
    .populate("property")
    .populate("owner");

    res.json(enquiries);
};