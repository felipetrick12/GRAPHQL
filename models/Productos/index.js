import { Schema, model } from "mongoose";

const ProductosSchema = Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  existecia: {
    type: Number,
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Productos", ProductosSchema);
