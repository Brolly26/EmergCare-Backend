import express from 'express'
import { updateDoctor, DeleteDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile } from "../Controllers/doctorController.js";
import { authenticate, restrict } from '../auth/verifyToken.js';
import reviewRouter from './review.js'

const router = express.Router();

router.use('/:doctorId/reviews', reviewRouter)

router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id' , authenticate,restrict(["doctor"]), updateDoctor)
router.delete('/:id', authenticate,restrict(["doctor"]),DeleteDoctor)
router.get('/perfil/eu', authenticate,restrict(["doctor"]),getDoctorProfile)

export default router; 