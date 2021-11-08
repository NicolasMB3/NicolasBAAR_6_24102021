const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Création d'un utilisateur
exports.signup = (req, res, next) => {
   // asynchrone = qui prend du temps
   // La méthode .hash permet de crypter notre mot de passe
   bcrypt.hash(req.body.password, 10)
      // Pour ensuite prendre le mot de passe crypter et va créer un utilisateur avec le mot de passe crypté
      .then(hash => {
         const user = new User({
            email: req.body.email,
            password: hash
         });
         // Une fois le cryptage du mot de passer terminer, nous sauvegardons l'utilisateur avec un message de validation ou d'erreur
         user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
            .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
};

// Connexion
exports.login = (req, res, next) => {
   // Récupération de l'utilisateur avec le mail rentré
   User.findOne({ email: req.body.email })
      .then(user => {
         // Erreur si l'utilisateur n'a pas été trouvé
         if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
         }
         // On compare avec le mot de passe de la base de donnée (en haché) et le mot de passe reçu
         bcrypt.compare(req.body.password, user.password)
            .then(valid => {
               // Si le mot de passe ne correspond pas, on affiche une erreur
               if (!valid) {
                  return res.status(401).json({ error: 'Mot de passe incorrect' });
               } 
               // Sinon on revoit son userID et un Token d'authentification
               res.status(200).json({
                  userId: user._id,
                  // Génére un token pour que l'utilisateur n'est pas à ce connecter à chaque fois
                  token: jwt.sign(
                     // permet d'encoder l'userid
                     { userId: user._id },
                     'PXNrFFk0HMwvbQWjmTDAWq0YtZRwvzDv5xGW11CY40WUxZIrTYvNTnej8RcsVo3y4NdRd0dguP7B9OpxbjSNHDjzROqe6cThSESgDFakTgU5PaCzuQyg9RHsXYQUNc4BVipaGh6tiEZhao4cjEZgBvhMra79MXkGWxP2quSW8GcVi8UY4a7pZoEiklb6qzUucvcoEb6qb1qfZzuRVxdwuzbbZfDyUBdzIqXQy0CAdAyog4v1f7yzQaV3q4QmyaYyjHI4m5flkgC3t8jtACTNMaNnOV6VxTHwI06f6bwPX6wE66qiklb6Vi8UY4a7WUxZIrTYvNWUxZIrTYvNpZoEikOboG8H',
                     { expiresIn: '24h'}
                  )
               });
            })
            // erreur de serveur
            .catch(error => res.status(500).json({ error }))
      })
      // Uniquement si on a un problème de connexion
      .catch(error => res.status(500).json({ error }))
};