const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { required } = require("joi");
const options = { toJSON: { virtuals: true } };
const campgroundSchema = Schema({
  title: String,
  images: [
    {
      url: String,
      fileName: String
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
}, options);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a style=text-decoration:none href=/campgrounds/${this._id}>${this.title}</a><strong>`
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
  if (doc) { await Review.deleteMany({ _id: { $in: doc.review } }) }
})

module.exports = mongoose.model("Campground", campgroundSchema);
