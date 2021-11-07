// Récupération de jwt pour pouvoir vérifier notre token
const jwt = require('jsonwebtoken');

// Middleware pour vérifier les tokens
module.exports = (req, res, next ) => {
   try {
      // Récupération du token sur le header de la requête
      const token = req.headers.authorization.split(' ')[1];
      // Comparaison entre le tocken du headers et de notre token secret
      const decodedToken = jwt.verify(token, 'PXNrFFk0HMwvbQWjmTDAWq0YtZRwvzDv5xGW11CY40WUxZIrTYvNTnej8RcsVo3y4NdRd0dguP7B9OpxbjSNHDjzROqe6cThSESgDFakTgU5PaCzuQyg9RHsXYQUNc4BVipaGh6tiEZhao4cjEZgBvhMra79MXkGWxP2quSW8GcVi8UY4a7pZoEiklb6qzUucvcoEb6qb1qfZzuRVxdwuzbbZfDyUBdzIqXQy0CAdAyog4v1f7yzQaV3q4QmyaYyjHI4m5flkgC3t8jtACTNMaNnOV6VxTHwI06f6bwPX6wE66qiklb6Vi8UY4a7WUxZIrTYvNWUxZIrTYvNpZoEikOboG8H');
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