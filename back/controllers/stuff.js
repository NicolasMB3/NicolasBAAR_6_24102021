// Routing
const Sauce = require('../models/Sauce');
// fs = filesystem
const fs = require('fs');

// Créer un élèment
exports.createSauce = (req, res, next) => {
   // Obtenir un objet utilisable
   const sauceObject = JSON.parse(req.body.Sauce);
   // Supprimer l'id que retourne le front
   delete sauceObject._id;
   // Création d'une nouvelle instance
   const sauceNew = new Sauce({
      // Syntaxe de décomposition : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      // Permet de faire une copie de tous les éléments de req.body
      ...sauceObject,
      // permet de récupérer le lien de notre image
      // req.protocal = récupérer le protocal de notre lien : http ou https
      // req.get('host') = permet de récupérer l'URL de notre lien : localhost
      // req.file.filename = permet de récupérer le nom du fichier
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
            ...JSON.parse(req.body.Sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         }
         fs.unlink(`images/${filename}`, () => {
            // Callback (ce qui nous retourne) qui envoie les commandes de suppression
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