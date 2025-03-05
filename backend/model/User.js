import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  phoneNumber: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  program: String,

  role: {
    type: String,
    enum: ['student', 'admin'],//add logic to check if the user is admin while registering
    default: 'student'
  },
  // Custom fields
  favoriteTopic: String,
  technicalSkill: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema, 'users');

export default User; 