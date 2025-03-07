// create-admin-user.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // Import bcryptjs to match your User model
import User from './model/User.js'; 

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
  try {
    const adminRoleId = "67c9e73f896a082052ed4f53";
    const plainPassword = "password123"; // This is what you'll use to log in
    
    // Check if the admin user already exists
    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    
    if (existingUser) {
      console.log("Admin user already exists. Updating roles...");
      
      // Update existing user to have admin role
      const updatedUser = await User.findOneAndUpdate(
        { email: "admin@gmail.com" },
        { 
          $addToSet: { roles: adminRoleId },
        },
        { new: true }
      );
      
      console.log("User updated:", updatedUser.email);
      console.log("Roles:", updatedUser.roles);
    } else {
      // Create new admin user with all required fields
      const newAdmin = new User({
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        password: plainPassword, // The pre-save hook in your User model will hash this
        roles: [adminRoleId],
        program: "Administration", // Adding if required
        studentNumber: "ADMIN001"
        // Add any other required fields from your schema
      });
      
      await newAdmin.save();
      console.log("New admin user created!");
      console.log("Email:", newAdmin.email);
      console.log("Your login password will be:", plainPassword); // For your reference
      console.log("Roles:", newAdmin.roles);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    // More detailed error logging
    if (error.errors) {
      console.log("Validation errors:");
      Object.keys(error.errors).forEach(field => {
        console.log(`- ${field}: ${error.errors[field].message}`);
      });
    }
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
createAdminUser();