import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    resource: String,
    actions: [String]
  }]
});

const Role = mongoose.model("Role", roleSchema, "roles");

export default Role;
