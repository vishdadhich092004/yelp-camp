const Campground = require("../models/campgrounds.js");
const Review = require("../models/review.js");

module.exports.createNewReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review Submitted!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review was deleted");
    res.redirect(`/campgrounds/${id}`);
}