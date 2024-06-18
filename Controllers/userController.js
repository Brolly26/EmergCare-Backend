import User from "../models/UserSchema.js";
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'
export const updateUser = async (req,res) =>{
    const id = req.params.id
    try {
        const updateUser = await User.findByIdAndUpdate(id, {$set:req.body}, {new:true})

        res.status(200).json({sucess:true, message:'Atualizado com sucesso!', data:updateUser})
    } catch (error) {
        res.status(500).json({sucess:false, message:'Falha ao atualizar!!!'})

    }
}

export const DeleteUser = async (req,res) =>{
    const id = req.params.id
    try {
       await User.findByIdAndDelete(id)

        res.status(200).json({sucess:true, message:'Deletado com sucesso!'})
    } catch (error) {
        res.status(500).json({sucess:false, message:'Falha ao deletar !!!'})

    }
}
export const getSingleUser = async (req,res) =>{
    const id = req.params.id
    try {
      const user =  await User.findById(id).select('-password')

        res.status(200).json({sucess:true, message:'Usuário encontrado', data:user})
    } catch (error) {
        res.status(404).json({sucess:false, message:'Usuário não encontrado !!!'})

    }
}

export const getAllUser = async (req,res) =>{
    try {
      const users =  await User.find({}).select('-password')

        res.status(200).json({sucess:true, message:'Usuários encontrados', data:users})
    } catch (error) {
        res.status(404).json({sucess:false, message:'Usuários não encontrados !!!'})

    }
}
export const getUserProfile = async(req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({success:false, message: 'Usuário não encontrado' })    
        }

        const {password, ...rest} = user._doc
        res.status(200).json({sucess:true, message:'informações do perfil estão sendo obtidas ', data:{...rest}})


    } catch (error) {
        return res.status(500).json({success:false, message: 'Erro inesperado' })
    }
}

export const getMyAppointments = async(req, res) =>{
    try {
        // passo 1 : recuperar agendamentos  da consulta para um usuário especifico
        const bookings = await Booking.find({user:req.userId})
        // passo 2 : extrair doctor ids para agendamentos de  consulta
        const doctorIds = bookings.map(el => el.doctor.id)

        // passo 3 : recuperar os doutores usando doctor ids
        const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password')
        res.status(200).json({success:true, message:'Os agendamentos estão sendo marcados', data:doctors})

    } catch (err) {
        return res.status(500).json({success:false, message: 'Erro inesperado' })

    }
}