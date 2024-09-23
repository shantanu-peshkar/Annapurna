const express = require('express');
const router = express.Router({ mergeParams: true });
const Token = require('../models/token');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware');

// Route to generate a token
router.post('/:id/token', isLoggedIn, async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect(`/listings/${listingId}`);
    }

    // Check if the user already generated a token for this listing
    const existingToken = await Token.findOne({ user: req.user._id, listing: listingId });
    if (existingToken) {
        req.flash('error', 'You already have a token for this listing.');
        return res.redirect(`/listings/${listingId}`);
    }

    // Create a new token for the user
    const newToken = new Token({
        user: req.user._id,
        listing: listingId
    });

    await newToken.save();
    req.flash('success', 'Token generated successfully!');
    res.redirect(`/listings/${listingId}`);
});

// Route to display all tokens for a listing
router.get('/:id/tokens', async (req, res) => {
    const listingId = req.params.id;

    // Find the listing without populating tokens
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    // Get all tokens for the listing and populate the user field to get user details
    const tokens = await Token.find({ listing: listingId }).populate('user');

    // Render the tokens page with the listing and tokens
    res.render('tokens/list', { listing, tokens ,currUser: req.user});
});

// Route to delete a single token
router.delete('/:id/tokens/:tokenId', isLoggedIn, async (req, res) => {
    const { id, tokenId } = req.params;

    // Find and delete the token
    await Token.findByIdAndDelete(tokenId);

    req.flash('success', 'Token deleted successfully!');
    res.redirect(`/listings/${id}/tokens`);
});

// Route to delete all tokens for a listing
router.delete('/:id/tokens', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    // Delete all tokens for the listing
    await Token.deleteMany({ listing: id });

    req.flash('success', 'All tokens deleted successfully!');
    res.redirect(`/listings/${id}/tokens`);
});

module.exports = router;
