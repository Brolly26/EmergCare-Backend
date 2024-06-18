import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {
    // Get token from headers
    const authToken = req.headers.authorization;

    // Check if the token exists
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'Sem token, autorização negada' });
    }
    
    try {
        const token = authToken.split(' ')[1];
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        req.role = decoded.role;
        next(); // Should be called after the function
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token está expirado' });
        }
        return res.status(401).json({ success: false, message: 'Token Inválido' });
    }
};

export const restrict = (roles) => async (req, res, next) => {
    const userId = req.userId;
    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
        user = patient;
    } else if (doctor) {
        user = doctor;
    } else {
        return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }

    if (!roles.includes(user.role)) {
        return res.status(401).json({ success: false, message: 'Você não está autorizado' });
    }

    next();
};
