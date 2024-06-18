import Review from '../models/ReviewSchema.js'
import Doctor from '../models/DoctorSchema.js'

//Pegar todas as avaliações
export const getAllReviews = async (req, res) =>{
    try {
        const reviews = await Review.find({})
        res.status(200).json({sucess:true, message: 'Sucesso', data: reviews})
    } catch (error) {
        res.status(404).json({sucess:false, message: 'Não encontrado'})
    }
}

// criar a avaliação
export const createReview = async(req, res) => {
    if(!req.body.doctor) req.body.doctor = req.params.doctorId
    if(!req.body.user) req.body.user = req.userId

    const newReview = new Review(req.body)
    try {
        const savedReview = await newReview.save()

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push:{reviews: savedReview._id}
        })
        res.status(200).json({sucess:true, message:'Avaliação enviada', data:savedReview})

    } catch (err) {
        res.status(500).json({sucess:false, message: err.message})

    }
}