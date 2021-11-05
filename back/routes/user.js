const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();

// Nous utilisons des post car le frontend va aussi nous envoyer des informations (email et mdp)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
