// REQUIRES
const express = require("express"); //  framework nodeJS, traite les requêtes http (routes), middlewares...
const mongoose = require("mongoose"); // facilite les interactions avec la BDD
const path = require("path"); // donne des outils pour faciliter le travail avec les fichiers et les chemins d'accès.
const helmet = require("helmet"); // sécurise l'application express en mettant en place différents headers HTTP
const hpp = require("hpp"); // contre les attaques par pollution des paramètres http
const mongoSanitize = require("express-mongo-sanitize"); // nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
require("dotenv").config(); // utilisation des variables d'environnement pour sécuriser les accès

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

app.use(mongoSanitize()); 
app.use(hpp()); 

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;