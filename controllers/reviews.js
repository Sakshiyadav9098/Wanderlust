const Listing = require("../models/listing");
const Review = require("../models/review");

// module.exports.createReview = async(req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);
  
//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review Created!");
//     res.redirect(`/listings/${listing._id}`);
//   }



// chatgpt
module.exports.createReview = async (req, res) => {
  try {
      console.log("Received review data:", req.body);
      let listing = await Listing.findById(req.params.id);

      if (!listing) {
          console.error("Listing not found!");
          req.flash("error", "Listing does not exist!");
          return res.redirect("/listings");
      }

      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;

      listing.reviews.push(newReview);

      await newReview.save();
      await Listing.updateOne({ _id: req.params.id }, { $push: { reviews: newReview._id } });

      console.log("Review created successfully:", newReview);

      req.flash("success", "New Review Created!");
      res.redirect(`/listings/${listing._id}`);
  } catch (error) {
      console.error("Error creating review:", error);
      req.flash("error", "Something went wrong!");
      res.redirect(`/listings/${req.params.id}`);
  }
};



module.exports.destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }