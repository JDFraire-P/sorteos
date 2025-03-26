import mongoose, { Schema, Document } from "mongoose";

export interface IOrden extends Document {
  uid: string; // Identificador único del folio, se genera con nanoid en el controlador
  sorteo: mongoose.Types.ObjectId; // Referencia al sorteo (se obtiene en el controlador)
  cliente: mongoose.Types.ObjectId; // Referencia al cliente (se obtiene en el controlador)
  boletos: number[]; // Números de boletos apartados 
  total: number; // Total a pagar (se calcula en el controlador)
  estado: "apartado" | "pagado"; // Estado del pago del folio (apartado o pagado) 
  fechaCreacion: Date; // Cuándo se generó el folio (se genera en el controlador)
  fechaConfirmacion?: Date; // Cuándo se confirmó el pago (Se genera en el controlador cuando se confirma el pago)
}

const OrdenSchema = new Schema<IOrden>({
  uid: { type: String, unique: true, required: true},
  sorteo: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
  cliente: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
  boletos: { type: [Number], required: true },
  total: { type: Number, required: true },
  estado: { type: String, enum: ["apartado", "pagado"], default: "apartado" },
  fechaCreacion: { type: Date, default: Date.now },
  fechaConfirmacion: { type: Date },
});



export default mongoose.models.Orden || mongoose.model<IOrden>("Orden", OrdenSchema);