import 'dotenv/config'; // to use the env file
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import courseRoutes from './routes/Course.routes.js';
import userRoutes from './routes/User.routes.js';
import connectDB from './config/db.js'; 
import path from 'path';
console.log(process.env.NODE_ENV);
const PORT = process.env.PORT 
;//wherevr it is hosted it will take that port otherwise 8080 local host

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());  
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api', courseRoutes);
app.use('/Users', userRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => 
    console.log(`Server listening on port ${PORT}`)
  );
});

//app.use('/', express.static(path.join(__dirname, '../react-client/dist')));
//app.use('/api', require('./routes/root'));net stat