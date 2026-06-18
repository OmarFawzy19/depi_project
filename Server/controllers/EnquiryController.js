const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const sendEmail = require("../utils/sendEmail");


exports.sendEnquiry = async (req,res)=>{

    const property = await Property.findById(
        req.params.propertyId
    ).populate("owner");

    const enquiry = await Enquiry.create({
        property:property._id,
        owner:property.owner._id,
        seeker:req.user.id,
        message:req.body.message
    });

    await sendEmail(
        property.owner.email,
        "New Property Enquiry",
        req.body.message
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