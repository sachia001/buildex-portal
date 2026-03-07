const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // სახელი
    lastName: { type: String, required: true },  // გვარი
    personalId: { type: String, required: true, unique: true }, // პ/ნ
    
    // 👇 ესენი გახდა არასავალდებულო (required: false), რომ ერორი არ ამოაგდოს
    position: { type: String, default: 'ექსპერტი' },
    email: { type: String, required: false },
    password: { type: String, required: false },
    competencies: [String],
    authExpiry: { type: Date },
    status: { type: String, default: 'აქტიური' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);