// const Joi=require("joi");
// module.exports. listingSchema=Joi.object(
//     {
//         listing:Joi.object({
//              title:Joi.string().required(),
//              description:Joi.string(),
//              location:Joi.string().required(),
//              city:Joi.string().required(),
//              price:Joi.string().required().min(0),
//              image:Joi.string().allow("",null)
//            }).required(),
//     }
// )
// module.exports.reviewSchema=Joi.object({
//     review:Joi.object({
//         rating:Joi.number().required(),
//         comment:Joi.string().required()
//     }).required()
// })

// module.exports.menuSchema = Joi.object({
//     menu: Joi.object({
//         image: Joi.object({
//             url: Joi.string().uri().required() // Ensure URL is valid and required
//         }).required(),
//         description: Joi.string(),
//         day: Joi.string().required()
//     }).required() // The whole "menu" object is required
// });

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),  // Title is required
        description: Joi.string().required(),  // Make description required to avoid Mongoose errors
        location: Joi.string().required(),  // Location is required
        city: Joi.string().required(),  // City is required
        price: Joi.number().min(0).required(),  // Ensure price is a number and >= 0
        image: Joi.string().allow("", null)  // Image can be null or an empty string
    }).required(),  // The whole listing object is required
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),  // Rating is required
        comment: Joi.string().required()  // Comment is required
    }).required(),
});

module.exports.menuSchema = Joi.object({
    menu: Joi.object({
        image: Joi.object({
            url: Joi.string().uri().required(),  // Ensure URL is valid and required
        }).required(),  // Image object is required
        description: Joi.string(),  // Description can be optional
        day: Joi.string().required()  // Day is required
    }).required(),  // The whole menu object is required
});

