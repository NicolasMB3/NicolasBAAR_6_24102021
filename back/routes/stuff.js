// Controler
const express = require('express');
const router = express.Router();
const ctrlSauce = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// api/stuff => argument en chaine de caractère (endpoint)
router.get('/', auth, ctrlSauce.displayAllSauce);
// Créer un nouveau élèment
router.post('/', auth, multer, ctrlSauce.createSauce);
// Récuérer un élèment
router.get('/:id', auth, ctrlSauce.displaySauce);
// Modifier un élèment sur la base de données
router.put('/:id', auth, multer, ctrlSauce.modifySauce);
// :id => route dynamique
// Supprimer un élèment sur la base de données
router.delete('/:id', auth, ctrlSauce.deleteSauce);

module.exports = router;