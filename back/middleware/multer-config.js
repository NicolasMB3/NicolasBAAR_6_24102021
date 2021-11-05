// Création du middleware
const multer = require('multer');
// Indication des types de fichier acceptés
const MINE_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png'
}

const storage = multer.diskStorage({
   // Destination des images importé 
   destination: (req, file, callback) => {
      callback(null, 'images')
   },
   // Permet de supprimer les espaces des noms de fichier et donne un nouveau nom comme : image02/11/21:19:23:20.jpg
   filename:(req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MINE_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension)
   }
});

// exportation de la fonction multer avec la constante storage et .single qui permet d'indiquer
// que nous générons uniquement le téléchargement d'image
module.exports = multer({ storage }).single('image');