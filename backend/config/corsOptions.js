// corsOptions.js
import allowedOrigins from './allowedOrigins.js';

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization'],
   optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

export default corsOptions;