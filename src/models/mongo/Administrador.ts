import mongoose, { Schema, Document } from "mongoose";

export interface IAdministrador extends Document {
  nickname: string; // Nombre de usuario
  password: string; // La contraseña se encripta en el controlador
}

const AdministradorSchema = new Schema<IAdministrador>({
  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
});

export default mongoose.models.Administrador || mongoose.model<IAdministrador>("Administrador", AdministradorSchema);