import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import doctorRouter from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000


const corsOptions = {
    origin:true
}

app.get('/', (req,res)=>{
    res.send('Api está funcionando')
})
//database connection
mongoose.set('strictQuery', false)
const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");

    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }

    } 



// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute) // domain/api/v1/auth/register
app.use('/api/v1/users', userRoute) 
app.use('/api/v1/doctors', doctorRouter) 
app.use('/api/v1/reviews', reviewRoute) 
app.use('/api/v1/bookings', bookingRoute) 


app.listen(port, ()=>{
    connectDB();
    console.log("Server está rodando na porta " + port)
})
// Gabriel2213  emergcarebackend