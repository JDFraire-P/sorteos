import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Ensure dotenv is configured with the correct path
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env.local') 
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ La variable de entorno MONGODB_URI no está definida en .env.local\n" +
    "Asegúrate de crear el archivo .env.local con la variable MONGODB_URI"
  );
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("📦 Conexión a MongoDB establecida");

    // Manejadores de eventos para la conexión
    mongoose.connection.on('error', err => {
      console.error('❌ Error en la conexión de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Desconexión de MongoDB');
      isConnected = false;
    });

  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};

export default connectDB;
