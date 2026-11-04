const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: null,
    },

    category: {
      type: String,
      required: true,
    },

   
    image: {
  type: String,
  default: "",
},

imagePublicId: {
  type: String,
  default: "",
},

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    colors: {
      type: [
        {
          name: String,
          hex: String,
        },
      ],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    reviews: {
      type: [
        {
          id: Number,
          name: String,
          rating: Number,
          text: String,
          date: String,
        },
      ],
      default: [],
    },

    // Admin se add hone wala product New Arrivals mein show hoga
    isNewArrival: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);