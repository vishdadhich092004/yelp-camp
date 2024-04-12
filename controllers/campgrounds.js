const Campground = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', "Succesfully created new Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "review",
        populate: 'author'
    }).populate('author');
    if (!campground) {
        req.flash('error', "No Such Campground found!");
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', "No Such Campground found!");
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    const images = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName);
        }
        await campground.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', "Campground Successfully Updated!");
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground was deleted!");
    res.redirect("/campgrounds");
}   
