const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    resume: {
      type: String,
      required: true,
    },
    contenu: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    datePublication: {
      type: Date,
      default: Date.now,
    },
    estPublie: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.pre("save", function (next) {
  if (this.isNew) {
    this.slug = this.titre
      .toLowerCase()
      .replace(/[éèê]/g, "e")
      .replace(/[àâ]/g, "a")
      .replace(/[ùû]/g, "u")
      .replace(/[ôö]/g, "o")
      .replace(/[ïî]/g, "i")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
