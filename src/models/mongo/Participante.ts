import mongoose, { Schema, Document } from "mongoose";
import countries from "@/data/countries.json";

export interface IParticipante extends Document {
  telefono: string; // Teléfono del cliente (identificador único)
  nombres: string; // Nombres del cliente
  apellidos: string; // Apellidos del cliente
  pais: string; // País del cliente (Código de la librería countries.json)
  estado: string; // Estado del cliente (Código de la librería countries.json)
}

const ParticipanteSchema = new Schema<IParticipante>({
  telefono: { type: String, required: true, unique: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  pais: { type: String, required: true, enum: countries.map(country => country.name) },
  estado: { type: String, required: true, enum: countries.flatMap(country => country.states.map(state => state.name)) } 
});

export default mongoose.models.Participante || mongoose.model<IParticipante>("Participante", ParticipanteSchema);