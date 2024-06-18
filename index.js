import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import doctorRouter from './Routes/doctor.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configuração de CORS
const corsOptions = {
  origin: '*', // Permite todas as origens durante o desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true, // Permite cookies e outros credenciais
};

app.use(cors(corsOptions)); // Aplica o middleware de CORS

// Middleware para lidar com requisições preflight OPTIONS
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('API está funcionando');
});

// Conexão com o banco de dados
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log('Conectado ao banco de dados com sucesso');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error.message);
  }
};

app.listen(port, () => {
  connectDB();
  console.log('Servidor está rodando na porta ' + port);
});
