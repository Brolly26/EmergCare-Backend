import mongoose from "mongoose";

// Defina o esquema para o Endereco
const EnderecoSchema = new mongoose.Schema({
  rua: { type: String },
  bairro: { type: String },
  cidade: { type: String },
  estado: { type: String },
  numero: { type: String },
  cep: { type: String },
});

// Defina o esquema para o Usuário
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  cpf: {type:String, required:true},
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  gender: { type: String, enum: ["male", "female", "other"] },
  endereco: { type: EnderecoSchema }, // Use o schema EnderecoSchema aqui

  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

export default mongoose.model("User", UserSchema);
