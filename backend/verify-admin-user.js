// fixed-verify-admin-user.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a function to verify the admin user
async function verifyAdminUser() {
  try {
    console.log("Connecting to MongoDB...");
    
    // Connect and wait for the connection to be established
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected successfully");
    
    // Now that we're connected, get the database
    const db = mongoose.connection.db;
    
    if (!db) {
      console.error("Failed to get database from connection");
      return;
    }
    
    const usersCollection = db.collection('users');
    
    if (!usersCollection) {
      console.error("Failed to get users collection");
      return;
    }
    
    // Find the admin user
    const adminUser = await usersCollection.findOne({ email: "admin@gmail.com" });
    
    if (adminUser) {
      console.log("\n✅ Admin user found!");
      console.log("\nUser details:");
      console.log("- ID:", adminUser._id);
      console.log("- Email:", adminUser.email);
      console.log("- Has password:", !!adminUser.password);
      console.log("- Password length:", adminUser.password?.length);
      console.log("- Roles:", adminUser.roles);
      
      // Check if roles array exists and contains the admin role
      const hasRolesArray = Array.isArray(adminUser.roles);
      console.log("- Has roles array:", hasRolesArray);
      
      if (hasRolesArray) {
        console.log("- Number of roles:", adminUser.roles.length);
        
        // Check for admin role
        const adminRoleId = "67c9e73f896a082052ed4f53";
        const hasAdminRole = adminUser.roles.some(role => 
          (role.toString && role.toString() === adminRoleId) || 
          (role._id && role._id.toString() === adminRoleId)
        );
        
        console.log("- Has admin role:", hasAdminRole);
      }
    } else {
      console.log("❌ Admin user NOT found! Check your email address or create the admin user.");
    }
  } catch (error) {
    console.error("Error verifying admin user:", error);
  } finally {
    // Close the connection when done
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
}

// Run the verification function
verifyAdminUser();