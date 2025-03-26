import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface para los premios del sorteo
 * PremioSorteo:
 * - descripcion: Descripción del premio
 * - condiciones: Condiciones para ganar el premio
 */ 
export interface IPremioSorteo {
  descripcion: string; // Descripción del premio
  Condiciones: string; // Condiciones para ganar el premio
}

/** 
 * Interface para los precios de los boletos
 * PrecioBoleto:  
 * - cantidad: Si se compran mas de esta cantidad de boletos, se aplica el precio 
 * - precio: Precio por boleto
 * 
 */
export interface IPrecioBoleto {
  cantidad: number;
  precio: number;
}

/**
 * Interface para el sorteo
 * ISorteo:
 * - titulo: Título del sorteo
 * - numero: Numero de sorteo 
 * - descripcion: Descripción del sorteo
 * - premios: Lista de premios
 * - fechaSorteo: Fecha del sorteo
 * - boletos: Cantidad de boletos disponibles
 * - precios: Lista de precios por cantidad de boletos
 * - tiempoSeleccion: Tiempo en segundos para seleccionar boletos
 * - tiempoApartado: Tiempo en segundos para apartar boletos
 */ 
export interface ISorteo extends Document {
  titulo: string;
  numero: number;
  descripcion: string;
  boletos: number;
  precios: IPrecioBoleto[];
  premios: IPremioSorteo[];
  fechaSorteo: Date;
}

/**
 * Schema para el sorteo
 * SorteoSchema:
 * - titulo: Título del sorteo
 * - numero: Numero de sorteo
 * - descripcion: Descripción del sorteo  
 * - premios: Lista de premios
 * - fechaSorteo: Fecha del sorteo
 * - boletos: Cantidad de boletos disponibles
 * - precios: Lista de precios por cantidad de boletos
 * - tiempoSeleccion: Tiempo en segundos para seleccionar boletos
 */
const SorteoSchema = new Schema<ISorteo>({
  titulo: { type: String, required: true },
  numero: { type: Number, required: true },
  descripcion: { type: String, required: true },
  boletos: { type: Number, required: true, default: 60000 },
  precios: [{ cantidad: Number, precio: Number, required: true}],
  premios: [{ descripcion: String, condiciones: String, required: true}],
  fechaSorteo: { type: Date, required: true },
});

export default mongoose.models.Sorteo || mongoose.model<ISorteo>("Sorteo", SorteoSchema); // Export model Sorteo or create a new one if it doesn't exist
