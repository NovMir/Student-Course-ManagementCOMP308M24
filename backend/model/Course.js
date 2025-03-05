import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: {
      type: String,
      required: false,
      unique: true
    },
    courseName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    semester: {
      type: String,
      required: false
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }, {
    timestamps: true
  });
  
  const Course = mongoose.model('Course', courseSchema , 'courses');
  
  export default Course;
  