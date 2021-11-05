const mongoose = require('mongoose');
// permet de n'avoir d'une donné d'utilisateur par collection
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
   // unique = permet de n'avoir qu'un seul mail par collection (peut créer des soucis à voir avec unique-validator)
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true }
});

// Permet de ne pas avoir plusieurs utilisateur avec la même addresse mail grâce à mongoose unique validator
userSchema.plugin(uniqueValidator);

// Export du module userChema grâce à la méthode .model de mongoose
module.exports = mongoose.model('User', userSchema);