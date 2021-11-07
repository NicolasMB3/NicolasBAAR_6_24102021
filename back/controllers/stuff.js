// Routing
const Sauce = require('../models/Sauce');
// fs = filesystem
const fs = require('fs');

// Créer un élèment
exports.createSauce = (req, res, next) => {
   // Obtenir un objet utilisable
   const sauceObject = JSON.parse(req.body.sauce);
   // Création d'une nouvelle instance
   const sauceNew = new Sauce({
      // Syntaxe de décomposition : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      // Permet de faire une copie de tous les éléments de req.body
      ...sauceObject,
      // permet de récupérer le lien de notre image
      // req.protocal = récupérer le protocal de notre lien : http ou https
      // req.get('host') = permet de récupérer l'URL de notre lien : localhost
      // req.file.filename = permet de récupérer le nom du fichier
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      userLiked: 0,
      userDisliked: 0,
   });
   // Méthode save permet d'enregistrer sauceNew dans la base de données
   sauceNew.save()
   // Si le post à fonctionner alors on affiche un status 201 et un JSON
   .then(() => res.status(201).json({ message : 'Objet enregistré!' }))
   // error est un racourcie de error : error
   .catch(error => res.status(400).json({ error }));
};

// Modifier un élèment
exports.modifySauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
   .then(sauceModify => {
      // unlink est une méthode de fs qui permet de supprimer un fichier
      const oldUrl = Sauce.imageUrl;
      const filename = sauceModify.imageUrl.split('/images/')[1];
      if (req.file) {
         const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         }
         fs.unlink(`images/${filename}`, () => {
            // Callback (ce qui nous retourne) qui envoie les commandes de mofification
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet modifié !'}))
              .catch(error => res.status(400).json({ error }));
         });
      } else {
         const sauceObject2 = req.body;
         sauceObject2.imageUrl = oldUrl;
         Sauce.updateOne({ _id: req.params.id }, { ...sauceObject2, _id: req.params.id })
           .then(() => res.status(200).json({ message: 'Objet modifié !'}))
           .catch(error => res.status(400).json({ error }));
      }
   })
   .catch(error => res.status(500).json({ error }))
};

// Ajouter un like ou un dislike
exports.updateLikeSauce = (req, res, next) => {
   let like = req.body.like
   let userId = req.body.userId
   let sauceId = req.params.id
   switch (like) {
      // Si l'utilisateur aime le produit :
      case 1 :
         Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
           .then(() => res.status(200).json({ message: `J'aime le produit ` + req.body.name }))
           .catch((error) => res.status(400).json({ error }))
         break;
      // Si l'utilisateur a enlever son like ou dislike :
      case 0 :
         Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
             if (sauce.usersLiked.includes(userId)) { 
               Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                 .then(() => res.status(200).json({ message: `Je n'aime plus le produit ` + req.body.name }))
                 .catch((error) => res.status(400).json({ error }))
             }
             if (sauce.usersDisliked.includes(userId)) { 
               Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                 .then(() => res.status(200).json({ message: `Je ne dislike plus le produit ` + req.body.name }))
                 .catch((error) => res.status(400).json({ error }))
             }
           })
           .catch((error) => res.status(404).json({ error }))
         break;
      // Si l'utilisateur n'aime pas le produit :
      case -1 :
         Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
           .then(() => { res.status(200).json({ message: `Je n'aime pas le produit ` + req.body.name }) })
           .catch((error) => res.status(400).json({ error }))
      break;
       
      default: console.log(error);
   }
};

// Supprimer un élèment
exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
   .then(sauce => {
      // récupération de URL complète
      // Le split nous permet de récupérer le premier élèment de notre tableau soit le nom de l'image
      const filename = sauce.imageUrl.split('/images/')[1];
      // unlink est une méthode de fs qui permet de supprimer un fichier
      fs.unlink(`images/${filename}`, () => {
         // Callback (ce qui nous retourne) qui envoie les commandes de suppression
         Sauce.deleteOne({ _id: req.params.id })
         .then(() => res.status(200).json({ message: 'Objet supprimé' }))
         .catch(error => res.status(400).json({ error }))
      })
   })
   .catch(error => res.status(500).json({ error }))
}

// Aficher un élèment unique
exports.displaySauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
   .then(sauce => res.status(200).json(sauce))
   .catch(error => res.status(400).json({ error }))
}

// Afficher tous les objets
exports.displayAllSauce = (req, res, next) => {
   Sauce.find()
   .then(sauces => res.status(200).json(sauces))
   .catch(error => res.status(400).json({ error }))
}