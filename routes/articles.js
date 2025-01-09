const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration de Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET tous les articles
router.get("/", async (req, res) => {
  try {
    console.log("Requête GET reçue pour tous les articles"); // Debug
    const articles = await Article.find({ estPublie: true }).sort({
      datePublication: -1,
    });
    console.log("Articles trouvés:", articles.length); // Debug
    res.json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET un article par ID ou slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    let article;
    const { idOrSlug } = req.params;

    // Vérifier si c'est un ID MongoDB valide
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

    if (isValidObjectId) {
      article = await Article.findById(idOrSlug);
    } else {
      article = await Article.findOne({ slug: idOrSlug });
    }

    if (!article) {
      return res.status(404).json({
        message: "Article non trouvé",
        requestedValue: idOrSlug,
      });
    }

    res.json(article);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche de l'article",
      error: error.message,
      requestedValue: req.params.idOrSlug,
    });
  }
});

// POST nouvel article avec image
router.post("/", async (req, res) => {
  try {
    console.log("Configuration Cloudinary:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: "***", // Pour la sécurité, ne pas logger le secret
    });

    let imageUrl;

    // Si l'image commence par 'http' ou '/', c'est déjà une URL
    if (req.body.image.startsWith("http") || req.body.image.startsWith("/")) {
      imageUrl = req.body.image;
    } else {
      // Upload sur Cloudinary
      const result = await cloudinary.uploader.upload(req.body.image);
      imageUrl = result.secure_url;
    }

    const article = new Article({
      titre: req.body.titre,
      resume: req.body.resume,
      contenu: req.body.contenu,
      image: imageUrl,
      datePublication: req.body.datePublication || new Date(),
      estPublie: req.body.estPublie || true,
    });

    const nouvelArticle = await article.save();
    res.status(201).json(nouvelArticle);
  } catch (error) {
    console.error("Erreur complète:", error);
    res.status(400).json({
      message: error.message,
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "défini" : "non défini",
        apiKey: process.env.CLOUDINARY_API_KEY ? "défini" : "non défini",
        apiSecret: process.env.CLOUDINARY_API_SECRET ? "défini" : "non défini",
      },
    });
  }
});

// PATCH modifier un article
router.patch("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // Met à jour les champs fournis
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] != null) {
        article[key] = req.body[key];
      }
    });

    const articleMisAJour = await article.save();
    res.json(articleMisAJour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer un article
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    await article.deleteOne();
    res.json({ message: "Article supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/articles/slug/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
