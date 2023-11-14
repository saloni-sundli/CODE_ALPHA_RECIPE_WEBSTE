const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Recipe = require("./recipeModel");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Connect to Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/recipes");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
  console.log("Connect to MongoDB");
});

app.post("/recipe", async (req, res) => {
  try {
    const { title, description, author, image, method, ingredients } = req.body;

    console.log("Received POST request");
    const newRecipe = new Recipe({
      title,
      description,
      author,
      image,
      method,
      ingredients: ingredients
        .split(",")
        .map(ingredient => ingredient.trim()),
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).send("Error adding recipe");
  }
});

app.get("/recipe", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "error getting recipes" });
  }
});

app.delete("/recipe/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (deleteRecipe) {
      res.status(200).json(deleteRecipe);
    } else {
      res.status(404).json({ error: "Task noy found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/recipe/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const { title, description, author, image, method, ingredients = ingredients.split(",").map(ingredient => ingredient.trim()) } = req.body;

    const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, {
      title,
      description,
      author,
      image,
      method,
      ingredients,
    },
      { new : true} // Return the update document
    );

    if(!updateRecipe) {
      return res.status(404).send("Recipe not found");
    }
    res.status(200).json(updateRecipe)
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("Error updating recipe");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
