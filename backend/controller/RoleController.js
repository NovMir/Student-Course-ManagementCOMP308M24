import Role from "../model/Role.js";



const seedRoles = async (req,res) => {
    try {
        const existingRoles = await Role.find();
        if (existingRoles.length > 0) {
          return res.status(400).json({ message: "Roles already exist" });
        }
    
        const roles = [
          { name: "admin", permissions: [{ resource: "users", actions: ["create", "read", "update", "delete"] }
        ,                                { resource : "courses", actions:["create","read","update","delete"]}] },
          { name: "student", permissions: [{ resource: "courses", actions: ["read", "enroll"] }] },
        ];
    
        await Role.insertMany(roles);
        res.status(201).json({ message: "Roles seeded successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error seeding roles", error });
      }
    };
    
    export default seedRoles ;