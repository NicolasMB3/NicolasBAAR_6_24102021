const express = require('express');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path')

mongoose.connect('mongodb+srv://user_01:nicolas03021998@openclassrooms.rqfwr.mongodb.net/fullStackProject?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware qui seras excuté et général qui n'a pas besoin de route.
app.use((req, res, next) => {
   // Ajout de header sur la réponse, * (tout le monde) à accès à l'origin de l'API
   res.setHeader('Access-Control-Allow-Origin', '*');
   // Ajout de header sur la réponse, * (tout le monde) à accès à certain headers et méthodes de l'API
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

// Transformer le corps d'une requête en JSON utilisable 
// BodyParser est maintenant déprécié
app.use(express.json());

// Autorisation à l'api d'utiliser de façon static le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

// Permet d'utiliser express sur les autres fichiers node
module.exports = app;