const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    image: String,
    method: String,
    ingredients: [String],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
