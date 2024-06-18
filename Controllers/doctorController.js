import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
export const updateDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const updateDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true })

        res.status(200).json({ sucess: true, message: 'Atualizado com sucesso!', data: updateDoctor })
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'Falha ao atualizar!!!' })

    }
}

export const DeleteDoctor = async (req, res) => {
    const id = req.params.id
    try {
        await Doctor.findByIdAndDelete(id)

        res.status(200).json({ sucess: true, message: 'Deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'Falha ao deletar !!!' })

    }
}
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const doctor = await Doctor.findById(id).populate('reviews').select('-password')

        res.status(200).json({ sucess: true, message: 'Médicos encontrado', data: doctor })
    } catch (error) {
        res.status(404).json({ sucess: false, message: 'Médicos não encontrado !!!' })

    }
}

export const getAllDoctor = async (req, res) => {
    try {
        const { query } = req.query

        let doctors;
        if (query) {
            doctors = await Doctor.find({ isApproved: 'approved', $or: [
            { name: { $regex: query, $options: 'i' } }, 
            { specialization: { $regex: query, $options: 'i' } },
             ],
           }).select("-password");
        } else {
              doctors = await Doctor.find({isApproved: 'approved'}).select('-password');

        }

        res.status(200).json({ sucess: true, message: 'Médicos encontrados com sucesso !', data: doctors })
    } catch (error) {
        res.status(404).json({ sucess: false, message: 'Médicos não encontrados !!!' })

    }
}
export const getDoctorProfile = async (req, res) =>{

        const doctorId = req.userId
    
        try {
            const doctor = await Doctor.findById(doctorId)
    
            if(!doctor){
                return res.status(404).json({success:false, message: 'Especialista não encontrado'})    
            }
    
            const {password, ...rest} = doctor._doc;
            const appointments =  await Booking.find({doctor:doctorId})
            res.status(200).json({sucess:true, message:'informações do perfil estão sendo obtidas ', data:{...rest, appointments}})
    
        } catch (error) {
            return res.status(500).json({success:false, message: 'Erro inesperado' })
        }
    }
