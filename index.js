import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import doctorRouter from './Routes/doctor.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_SITE_URL, // Altere aqui para permitir solicitações do seu frontend no Vercel
  credentials: true,
};

app.get('/', (req, res) => {
  res.send('Api está funcionando');
});

// Conexão com o banco de dados
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("Conectado ao banco de dados com sucesso");
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error.message);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Rotas
app.use('/api/v1/auth', authRoute); // domain/api/v1/auth/register
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

app.listen(port, () => {
  connectDB();
  console.log("Servidor está rodando na porta " + port);
});
