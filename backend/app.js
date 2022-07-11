const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");


const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

mongoose.connect(
  process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

app.use(express.json());

app.use(mongoSanitize()); // against query selector injection attacks
app.use(hpp()); // against http pollution attacks

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;