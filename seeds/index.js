const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const { places, descriptors } = require("./seedHelper");
const cities = require("./cities");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(console.log("Database Connected!"))
  .catch(console.log("MEHHHHHH!?!"));

const randElement = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 245; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // Your User ID
      author: "660058136db17e79e92dd433",
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${randElement(places)} ${randElement(descriptors)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores quo molestias ea aspernatur asperiores repellat, nostrum aut esse provident nemo dignissimos delectus voluptatem sed est placeat debitis blanditiis quae vero!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[rand].longitude,
          cities[rand].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dftxgkn0d/image/upload/v1712206735/YelpCamp/jdmqzceew8rteayc0pkd.avif',
          fileName: 'YelpCamp/jdmqzceew8rteayc0pkd',
        },
        {
          url: 'https://res.cloudinary.com/dftxgkn0d/image/upload/v1712206735/YelpCamp/oderxt9zf1f6vr5red5g.avif',
          fileName: 'YelpCamp/oderxt9zf1f6vr5red5g',
        },
        {
          url: 'https://res.cloudinary.com/dftxgkn0d/image/upload/v1712206735/YelpCamp/favb2v2tg3lt0quaupe2.avif',
          fileName: 'YelpCamp/favb2v2tg3lt0quaupe2',
        }
      ]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
