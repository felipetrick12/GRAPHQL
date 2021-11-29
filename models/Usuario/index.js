import { Schema, model } from "mongoose";

const UsuariosSchema = Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Usuario", UsuariosSchema);
