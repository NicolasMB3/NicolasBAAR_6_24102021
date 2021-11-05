// Récupération de jwt pour pouvoir vérifier notre token
const jwt = require('jsonwebtoken');

// Middleware pour vérifier les tokens
module.exports = (req, res, next ) => {
   try {
      // Récupération du token sur le header de la requête
      const token = req.headers.authorization.split(' ')[1];
      // Comparaison entre le tocken du headers et de notre token secret
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      // Récupération de l'userID (token)
      const userId = decodedToken.userId;
      // Vérification pour vérifier que le token est bien le même, sinon erreur avec un throw
      if (req.body.userId && req.body.userId !== userId) {
         throw 'User ID non valable';
      } else {
         next();
      }
      // Erreur si le token n'hésiste pas
   } catch (error) {
      res.status(401).json({ error: error | 'Requête non valide' })
   }
};