import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = user => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d"
    })
}

export const register = async (req, res) => {

    const { email, password, name, role, photo, gender, rua, bairro, cidade, estado, numero, cep, cpf } = req.body

    try {

        let user = null

        if (role == 'patient') {
            user = await User.findOne({ email })
        }
        else if (role == 'doctor') {
            user = await Doctor.findOne({ email })
        }
        // Checar se o usuário existe
        if (user) {
            return res.status(400).json({ message: 'Usuário já existente' })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        if (role == 'patient') {
            user = new User({
                name,
                cpf,
                email,
                password: hashPassword,
                photo,
                gender,
                role,
                cep,
                rua,
                bairro,
                cidade,
                estado,
                numero
            })
        }

        if (role == 'doctor') {
            user = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role,
                cep,
                cpf,
                rua,
                bairro,
                cidade,
                estado,
                numero
            })
        }

        await user.save()
        res.status(200).json({ sucess: true, message: 'Usuário criado com sucesso!' })

    } catch (err) {
        res.status(404).json({ sucess: false, message: 'Erro interno, tente novamente' })


    }
}


export const login = async (req, res) => {
    const { email } = req.body
    try {
        let user = null;

        const patient = await User.findOne({ email })
        const doctor = await Doctor.findOne({ email })
        if (patient) {
            user = patient
        }
        if (doctor) {
            user = doctor
        }

        //Checar se o usuário existe ou não
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        // Comparar senha
        const isPassWordMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isPassWordMatch) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        // Pegar o token
        const token = generateToken(user)


        const { password, role, endereco, appointment, ...rest } = user._doc;
        res.status(200).json({ message: "Login efetuado com sucesso!", token, data: { ...rest }, role, endereco });


    } catch (err) {
        res.status(400).json({ message: "Falha no login" });

    }
}