Student Course management system 

Student features 
Authentication using JWT and HTTPOnly cookies
Add courses to their schedule
Update course details (e.g., change section)
Drop courses from their schedule
View all courses they are currently taking

Admin Features

Add new students to the system
List all students in the database
List all available courses
View all students taking a specific course

Technical Architecture
Express REST API with full CRUD operations for students and courses
MongoDB database integration with Mongoose schemas
JWT authentication with HTTP-only cookies for security
MVC architecture with separate models, controllers, and routes
Student model with all required fields plus custom fields (favoriteSubject and technicalSkill)
Course model with reference to students using MongoDB relationships
Middleware for authentication and admin authorization
React application using functional components and hooks
User authentication with protected routes
Student features:

Login functionality
Course registration (add courses)
Update course details (change section)
Drop courses
View enrolled courses


Admin features:

Add new students to the system
View all students in the database
View all available courses
View students enrolled in a specific course
