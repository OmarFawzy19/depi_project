require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const prop = await Property.findOne({}).populate('owner');
    if (!prop) {
      console.log('NO_PROPERTY');
    } else {
      console.log('PROPERTY_ID', prop._id.toString());
      console.log('OWNER_EMAIL', prop.owner && prop.owner.email);
      console.log('OWNER_NAME', prop.owner && prop.owner.name);
      console.log('PROPERTY_TITLE', prop.title);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERROR', err);
  }
})();
