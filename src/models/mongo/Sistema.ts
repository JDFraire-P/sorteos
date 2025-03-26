// Coleccion para almacenar configuraciones del sistema
import mongoose, { Schema, Document } from "mongoose";

/**
 * Interfaz para las cuentas bancarias dentro de la colección de configuraciones del sistema
 * titular: titular de la cuenta bancaria
 * numero: número de la cuenta bancaria
 * tipo: tipo de cuenta bancaria
 * banco: banco al que pertenece la cuenta bancaria
 */ 
export interface ICuentaBancaria {
  titular: string;
  numero: string;
  tipo: string;
  banco: string;
}

/**
 * Interfaz para las redes sociales dentro de la colección de configuraciones del sistema
 * nombre: nombre de la red social
 * url: url de la red social
 */  
export interface IRedSocial {
  nombre: string;
  url: string;
}

/**     
 * Interfaz para las configuraciones del sistema
 * nombre: nombre del sistema
 * cuentasBancarias: cuentas bancarias del sistema
 * redesSociales: redes sociales del sistema
 * tiempoExpiracionBoletosSeleccionados: tiempo de expiración de boletos seleccionados
 * tiempoExpiracionBoletosApartados: tiempo de expiración de boletos apartados
 */
export interface ISistema extends Document {
  nombre: string;
  cuentasBancarias: ICuentaBancaria[];
  redesSociales: IRedSocial[];
  tiempoExpiracionBoletosSeleccionados: number;
  tiempoExpiracionBoletosApartados: number;
}

/**
 * Esquema para la colección de configuraciones del sistema
 */
const SistemaSchema = new Schema<ISistema>({
  nombre: { type: String, required: true },
  cuentasBancarias: [{titular: String, numero: String, tipo: String, banco: String, required: true }],
  redesSociales: [{nombre: String, url: String, required: true }],
  tiempoExpiracionBoletosSeleccionados: { type: Number, required: true, default: 60 * 8 }, // 8 minutos (480 segundos)
  tiempoExpiracionBoletosApartados: { type: Number, required: true, default: 60 * 60 * 24 * 7 } // 7 días (604800 segundos)
});

// Exportar el modelo
export default mongoose.models.Sistema || mongoose.model<ISistema>("Sistema", SistemaSchema);