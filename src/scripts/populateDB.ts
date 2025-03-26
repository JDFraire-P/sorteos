import mongoose from "mongoose";
import connectDB from "@/lib/mongo"; // Función para conectar a MongoDB
import Admin from "@/models/mongo/Administrador";
import Sorteo from "@/models/mongo/Sorteo";
import Cliente, { ICliente } from "@/models/mongo/Participante";
import Folio from "@/models/mongo/Orden";
import Boleto from "@/models/Boleto";
import { randomUUID } from "crypto";


// Utilidad para generar números aleatorios en un rango
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const createTestData = async () => {
  console.log("🚀 Creando datos de prueba...");

  // Eliminar datos existentes
  await Admin.deleteMany({});
  await Sorteo.deleteMany({});
  await Cliente.deleteMany({});
  await Folio.deleteMany({});
  await Boleto.deleteMany({});

  // 1. Crear 1 Admin
  const admin = new Admin({
    nickname: "admin",
    password: "password123" // Se aplicará hash en el pre-save
  });
  await admin.save();
  console.log("👤 Admin creado.");

  // 2. Crear 2 Sorteos
  const sorteosData = [
    {
      titulo: "Sorteo de un Auto",
      descripcion: "Gana un auto último modelo.",
      premioPrincipal: "Auto 2024",
      fechaInicio: new Date(),
      fechaSorteo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // en 7 días
      condiciones: "Compra un boleto y participa.",
      precios: [{ cantidad: 1, precio: 100 }],
      tiempoSeleccion: 60,
      tiempoApartado: 300
    },
    {
      titulo: "Sorteo de una Moto",
      descripcion: "Gana una motocicleta deportiva.",
      premioPrincipal: "Moto 2024",
      fechaInicio: new Date(),
      fechaSorteo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // en 10 días
      condiciones: "Compra un boleto y participa.",
      precios: [{ cantidad: 1, precio: 50 }],
      tiempoSeleccion: 60,
      tiempoApartado: 300
    }
  ];

  const sorteos = await Sorteo.insertMany(sorteosData);
  console.log("🎟️ 2 Sorteos creados.");

  // Para asignar números de boletos secuenciales por sorteo, usamos un contador por cada sorteo.
  const boletoCounters: { [sorteoId: string]: number } = {};
  sorteos.forEach((sorteo) => {
    boletoCounters[sorteo._id.toString()] = 1;
  });

  // 3. Crear 40 Clientes
  const clientes: ICliente[] = [];
  for (let i = 1; i <= 40; i++) {
    const cliente = new Cliente({
      telefono: `55500000${i}`,
      nombres: `Cliente ${i}`,
      estado: "Ciudad de México",
      apellidos: "Test"
    });
    clientes.push(cliente);
  }
  await Cliente.insertMany(clientes);
  console.log("👥 40 Clientes creados.");

  // 4. Por cada Cliente, crear de 0 a 3 Folios y sus Boletos asociados
  for (const cliente of clientes) {
    const foliosCount = randomInt(0, 3); // 0 a 3 folios por cliente
    for (let f = 0; f < foliosCount; f++) {
      // Seleccionar aleatoriamente uno de los 2 sorteos para este folio
      const sorteo = sorteos[randomInt(0, sorteos.length - 1)];
      // Escoger estado aleatorio para el folio ("pendiente" o "pagado")
      const folioEstado = Math.random() < 0.5 ? "pendiente" : "pagado";
    
      // Crear el folio con los campos requeridos:
      const folio = new Folio({
        uid: randomUUID(), // Genera un UID único para el folio
        cliente: cliente._id,
        boletos: [],
        total: 0, // Se actualizará luego
        estado: folioEstado,
        fechaApartado: new Date(), // Utiliza la propiedad que define el modelo
        fechaConfirmacion: folioEstado === "pagado" ? new Date() : undefined
      });
      await folio.save();
    
      // Generar entre 1 y 20 boletos para este folio
      const boletosCount = randomInt(1, 20);
      const boletosIds: mongoose.Types.ObjectId[] = [];
    
      for (let b = 0; b < boletosCount; b++) {
        // Obtener el siguiente número de boleto para el sorteo
        const currentBoletoNumber = boletoCounters[sorteo._id.toString()]++;
        // Crear el boleto con estado según el folio
        const boleto = new Boleto({
          numero: currentBoletoNumber,
          sorteoId: sorteo._id,
          estado: folioEstado === "pagado" ? "comprado" : "apartado",
          folioId: folio._id
        });
        await boleto.save();
        boletosIds.push(boleto._id);
      }
    
      // Calcular el total según el precio definido en el sorteo (usamos el primer precio)
      const precioUnitario = sorteo.precios[0].precio;
      folio.boletos = boletosIds;
      folio.total = boletosCount * precioUnitario;
      await folio.save();
    }    
  }
  console.log("📑 Folios y boletos creados para los clientes.");

  mongoose.connection.close();
  console.log("🔌 Conexión cerrada.");
};

const run = async () => {
  await connectDB();
  await createTestData();
};

run();
