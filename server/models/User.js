const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  avatar: { type: String, default: '' },
  
  // NEW: Custom goals set by the user from the calculator
  macroGoals: {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

userSchema.pre('save', async function () {
  // If the password wasn't changed, just return (no next needed!)
  if (!this.isModified('password')) {
    return; 
  }
  
  // If it is a new user or a changed password, hash it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);