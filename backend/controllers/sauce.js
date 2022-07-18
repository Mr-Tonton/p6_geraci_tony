const Sauce = require('../models/Sauce');
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error: error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce saved successfully!' }))
    .catch( error => res.status(400).json({ error: error }));
};

exports.updateSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId == userId) {
        // utilisateur qui a créé la sauce 
        const saucesObject = req.file ?
          {
            ...req.body.sauce,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
          Sauce.findOne({ _id: req.params.id})
          .then(sauce => {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => { 
        Sauce.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
          .then(() => res.status(201).json({ message: 'Sauce modifiée !' }))
          .catch(error => res.status(400).json({ message: error }))
      });
    }).catch(error => res.status(500).json({ message: error }))
  }
      else {
        res.status(403).json({ message : "Seul l'utilisateur qui a créé la sauce peut la modifier !"})
        .catch((error) => res.status(403).json({ message: error }));
  }})
};

exports.deleteSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId == userId) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ message: error }));
        });
      }
      else {
        res.status(403).json({ message: "Seul l'utilisateur qui a créé la sauce peut la supprimer" })
          .catch((error) => res.status(403).json({ message: error }));
      }
    })
    .catch(error => res.status(500).json({ message: error }));
  }

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  switch (like) {
    case 1:
      Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } }) // On push sur l'array userLiked l'userId et on incrémente likes
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }))
      break;

    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } }) // On retire l'userId de l'array userLiked et on décrémente likes
              .then(() => res.status(200).json({ message: `Je retire mon like` }))
              .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }) // On retire l'userId de l'array userLiked et on décrémente dislikes
              .then(() => res.status(200).json({ message: `Je retire mon dislike` }))
              .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => { res.status(404).json({ error }); });
      break;

    case -1:
      Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }) // On push sur l'array userLiked l'userId et on incrémente dislikes
        .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
        .catch((error) => res.status(400).json({ error }))
      break;
    default:
      console.log(error);
  }
}