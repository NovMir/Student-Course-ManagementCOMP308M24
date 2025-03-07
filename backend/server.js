import 'dotenv/config'; // to use the env file
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import courseRoutes from './routes/Course.routes.js';
import userRoutes from './routes/User.routes.js';
import connectDB from './config/db.js'; 
import authroutes from './routes/auth.routes.js';
import roleRouter from './routes/roleRoutes.js';
console.log(process.env.NODE_ENV);
const PORT = process.env.PORT ;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());  

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);//user endpoints
app.use('/api/auth', authroutes);//auth endpoints
app.use('/api/roles/seed', roleRouter);//role

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => 
    console.log(`Server listening on port ${PORT}`)
  );
});
