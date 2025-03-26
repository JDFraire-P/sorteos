/**
 * Servicio para interactuar con la base de datos MongoDB
 */
import mongoose from "mongoose";
import connectDB from "@/lib/mongo";
import Administrador, { IAdministrador } from "@/models/mongo/Administrador";
import Orden, { IOrden } from "@/models/mongo/Orden";
import Participante, { IParticipante } from "@/models/mongo/Participante";
import Sorteo, { ISorteo, IPremioSorteo, IPrecioBoleto } from "@/models/mongo/Sorteo";
import Sistema, { ISistema } from "@/models/mongo/Sistema";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ", 20);

interface IMongo {
    isConnected: boolean;
    connect: () => Promise<void>;
    Administrador: {
        // Create Administrador  [CREATE]
        create: (nickname: string, password: string) => Promise<IAdministrador>;
        // verify password [READ]
        verifyPassword: (nickname: string, password: string) => Promise<boolean>;
        // Get Administrador by nickname  [READ]
        getByNickname: (nickname: string) => Promise<IAdministrador | null>;
        // Get all Administradores  [READ]
        getAll: () => Promise<IAdministrador[]>;
        // change password [UPDATE]
        changePassword: (nickname: string, password: string) => Promise<mongoose.UpdateResult>;
        // change nickname [UPDATE]
        changeNickname: (nickname: string, newNickname: string) => Promise<mongoose.UpdateResult>;
        // delete Administrador [DELETE]
        deleteByNickname: (nickname: string) => Promise<mongoose.DeleteResult>;
    };
    Sorteo: {
        // Create Sorteo  [CREATE]
        create: (titulo: string, descripcion: string, boletos: number, precios: IPrecioBoleto[], premios: IPremioSorteo[], fechaFin: Date) => Promise<ISorteo>;
        // Get Sorteo by numero  [READ]
        getByNumero: (numero: number) => Promise<ISorteo | null>;
        // Get all Sorteos with basic info  [READ]
        getAllBasicInfo: () => Promise<ISorteo[]>;
        // Get ID by numero  [READ]
        getIDByNumero: (numero: number) => Promise<string>;
        // Get Sorteo by ID  [READ]
        getByID: (id: string) => Promise<ISorteo | null>;
        // Change end date [UPDATE]
        changeEndDate: (id: string, fechaFin: Date) => Promise<mongoose.UpdateResult>;
        // Change title [UPDATE]
        changeTitle: (id: string, titulo: string) => Promise<mongoose.UpdateResult>;
        // Change description [UPDATE]
        changeDescription: (id: string, descripcion: string) => Promise<mongoose.UpdateResult>;
        // change boletos price [UPDATE]
        changeBoletosPrice: (id: string, precios: IPrecioBoleto[]) => Promise<mongoose.UpdateResult>;
        // change premios [UPDATE]
        changePremios: (id: string, premios: IPremioSorteo[]) => Promise<mongoose.UpdateResult>;
        // delete Sorteo [DELETE]
        delete: (id: string) => Promise<mongoose.DeleteResult>;
    };
    Orden: {
        // Create Orden by sorteo number and participante phone [CREATE]
        createByPhone: (sorteoNumero: number, participanteTelefono: string, boletos: number[]) => Promise<IOrden>;  
        // Create Orden by sorteo ID and participante ID [CREATE]
        createByIDs: (sorteoID: string, participanteID: string, boletos: number[]) => Promise<IOrden>;
        // Get all boletos numbers by sorteo number [READ]
        getBoletosNumbers: (sorteoNumero: number) => Promise<number[]>; 
        // Get all boletos numbers apartados by sorteo number [READ]
        getBoletosNumbersApartados: (sorteoNumero: number) => Promise<number[]>;
        // Get all boletos numbers comprados by sorteo number [READ]
        getBoletosNumbersComprados: (sorteoNumero: number) => Promise<number[]>;
        // Get Orden by UID  [READ]
        getByUID: (uid: string) => Promise<IOrden | null>;
        // Get by sorteo number and participante phone, can be a list of orders [READ]  
        getByPhone: (sorteoNumero: number, participanteTelefono: string) => Promise<IOrden[] | null>;
        // Get by sorteo number and boleto number, only one order can be returned [READ]
        getBySorteoNumeroAndBoletoNumber: (sorteoNumero: number, boletoNumber: number) => Promise<IOrden | null>;
        // Set pagado by UID [UPDATE]
        setPagadoByUID: (uid: string) => Promise<mongoose.UpdateResult>;
        // Set apartado by UID [UPDATE]
        setApartadoByUID: (uid: string) => Promise<mongoose.UpdateResult>;
        // delete Orden by UID [DELETE]
        deleteByUID: (uid: string) => Promise<mongoose.DeleteResult>;
    };
    Participante: {
        // Create Participante [CREATE]
        create: (nombre: string, telefono: string, pais: string, estado: string) => Promise<IParticipante>;
        // Get Participante by phone [READ]
        getByPhone: (telefono: string) => Promise<IParticipante | null>;
        // Get ID by phone [READ]
        getIDByPhone: (telefono: string) => Promise<string>;
        // Get all Participantes [READ]
        getAll: () => Promise<IParticipante[]>;
        // Get Participante by ID [READ]
        getByID: (id: string) => Promise<IParticipante | null>;
        // Change name by phone [UPDATE]
        changeNameByPhone: (telefono: string, nombre: string) => Promise<mongoose.UpdateResult>;
        // Change phone by phone [UPDATE]
        changePhoneByPhone: (telefono: string, nuevoTelefono: string) => Promise<mongoose.UpdateResult>;
        // Change country by phone [UPDATE]
        changeCountryByPhone: (telefono: string, nuevoPais: string) => Promise<mongoose.UpdateResult>;
        // Change state by phone [UPDATE]
        changeStateByPhone: (telefono: string, nuevoEstado: string) => Promise<mongoose.UpdateResult>;
        // update participante by id [UPDATE]
        updateByID: (id: string, nombre: string, telefono: string, pais: string, estado: string) => Promise<mongoose.UpdateResult>;
        // Delete Participante [DELETE]
        delete: (id: string) => Promise<mongoose.DeleteResult>;
    };
    Sistema: {
        // Get all sistemas [READ]
        getAll: () => Promise<ISistema[]>;
        // Get sistema by ID [READ]
        getByID: (id: string) => Promise<ISistema | null>;
        // Change name by ID [UPDATE]
        changeNameByID: (id: string, nombre: string) => Promise<mongoose.UpdateResult>;
        // Change description by ID [UPDATE]
        changeDescriptionByID: (id: string, descripcion: string) => Promise<mongoose.UpdateResult>;
        // delete Sistema by ID [DELETE]
        deleteByID: (id: string) => Promise<mongoose.DeleteResult>;
    };
}

const Mongo: IMongo = {
    isConnected: false,

    // ** Conectar a la base de datos **
    connect: async () => {
        await connectDB();
    },

    // ** Administrador CRUD **
    Administrador: {
        // Create Administrador  [CREATE]
        create: async (nickname: string, password: string) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await Administrador.create({ nickname, password: hashedPassword });
        },

        // verify password [READ]
        verifyPassword: async (nickname: string, password: string) => {
            const admin = await Administrador.findOne({ nickname });
            return await bcrypt.compare(password, admin?.password || "");
        },

        // Get Administrador by nickname  [READ]
        getByNickname: async (nickname: string) => {
            return await Administrador.findOne({ nickname });
        },

        // Get all Administradores  [READ]
        getAll: async () => {
            return await Administrador.find();
        },

        // change password [UPDATE]
        changePassword: async (nickname: string, password: string) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await Administrador.updateOne({ nickname }, { password: hashedPassword });
        },

        // change nickname [UPDATE]
        changeNickname: async (nickname: string, newNickname: string) => {
            return await Administrador.updateOne({ nickname }, { nickname: newNickname });
        },

        // delete Administrador [DELETE]
        deleteByNickname: async (nickname: string) => {
            return await Administrador.deleteOne({ nickname });
        },
    },

    // ** Sorteo CRUD **
    Sorteo: {
        // Create Sorteo  [CREATE]
        create: async (titulo: string, descripcion: string, boletos: number, precios: IPrecioBoleto[], premios: IPremioSorteo[], fechaFin: Date) => {
            const numero = await Sorteo.countDocuments() + 1;
            return await Sorteo.create({ titulo, numero, descripcion, boletos, precios, premios, fechaFin });
        },

        // Get Sorteo by numero  [READ]
        getByNumero: async (numero: number) => {
            return await Sorteo.findOne({ numero });
        },

        // Get all Sorteos with basic info  [READ]
        getAllBasicInfo: async () => {
            return await Sorteo.find({}, { titulo: 1, numero: 1, descripcion: 1, fechaSorteo: 1 });
        },

        // Get ID by numero  [READ]
        getIDByNumero: async (numero: number) => {
            const sorteo = await Sorteo.findOne({ numero }, { _id: 1 });
            if (!sorteo) throw new Error(`No se encontró el sorteo con número ${numero}`);
            return sorteo._id.toString();
        },

        // Get Sorteo by ID  [READ]
        getByID: async (id: string) => {
            return await Sorteo.findById(id);
        },
        
        // Change end date [UPDATE]
        changeEndDate: async (id: string, fechaFin: Date) => {
            return await Sorteo.updateOne({ _id: id }, { fechaFin });
        },

        // Change title [UPDATE]    
        changeTitle: async (id: string, titulo: string) => {
            return await Sorteo.updateOne({ _id: id }, { titulo });
        },

        // Change description [UPDATE]
        changeDescription: async (id: string, descripcion: string) => {
            return await Sorteo.updateOne({ _id: id }, { descripcion });
        },  

        // change boletos price [UPDATE]
        changeBoletosPrice: async (id: string, precios: IPrecioBoleto[]) => {
            return await Sorteo.updateOne({ _id: id }, { precios });
        },
        
        // change premios [UPDATE]
        changePremios: async (id: string, premios: IPremioSorteo[]) => {    
            return await Sorteo.updateOne({ _id: id }, { premios });
        },

        // delete Sorteo [DELETE]
        delete: async (id: string) => {
            return await Sorteo.deleteOne({ _id: id });
        }
    },

    // ** Orden CRUD **
    Orden: {
        // Create Orden by sorteo number and participante phone [CREATE]
        createByPhone: async (sorteoNumero: number, participanteTelefono: string, boletos: number[]) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            const participante = await Participante.findOne({ telefono: participanteTelefono }, { _id: 1 });
            if (!participante) throw new Error("El participante no existe");
            return await Mongo.Orden.createByIDs(sorteoID._id.toString(), participante._id.toString(), boletos);
        },      

        // Create Orden  [CREATE]
        createByIDs: async (sorteoID: string, participanteID: string, boletos: number[]) => {
            // generar un UID unico 
            let uid = "";   
            while (uid === "") {
                uid = nanoid();
                const orden = await Orden.findOne({ uid }, { uid: 1 });
                if (orden) uid = "";
            }
            // verificar si el sorteo existe
            const sorteo = await Sorteo.findById(sorteoID);
            if (!sorteo) throw new Error("El sorteo no existe");
            // verificar si el participante existe
            const participante = await Participante.findById(participanteID);
            if (!participante) throw new Error("El participante no existe");
            // calcular el total de la orden, se toma la longitud del array de boletos y se multiplica por el precio indicado el la lista de precios del sorteo, se debe obtener el precio mas cercano a la cantidad de boletos indicada en la lista de precios del sorteo, la cantidad de boletos en IPrecioBoleto es el minimo de boletos que se tiene que comprar para obtener el precio indicado
            const precioBoleto = sorteo.precios
            .filter((precio: IPrecioBoleto) => precio.cantidad <= boletos.length) 
            .sort((a: IPrecioBoleto, b: IPrecioBoleto) => b.cantidad - a.cantidad)[0]?.precio || sorteo.precios[0].precio; 
            const total = boletos.length * precioBoleto;
            // crear la orden
            return await Orden.create({ uid, sorteo: sorteoID, participante: participanteID, boletos, total });
        },

        // Get all boletos numbers by sorteo number [READ]
        getBoletosNumbers: async (sorteoNumero: number) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            const ordenes = await Orden.find({ sorteo: sorteoID._id }, { boletos: 1 });
            return ordenes.flatMap(orden => orden.boletos);
        },

        // Get all boletos numbers apartados by sorteo number [READ]
        getBoletosNumbersApartados: async (sorteoNumero: number) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            const ordenes = await Orden.find({ sorteo: sorteoID._id, estado: "apartado" }, { boletos: 1 });
            return ordenes.flatMap(orden => orden.boletos);
        },

        // Get all boletos numbers comprados by sorteo number [READ]
        getBoletosNumbersComprados: async (sorteoNumero: number) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            const ordenes = await Orden.find({ sorteo: sorteoID._id, estado: "pagado" }, { boletos: 1 });
            return ordenes.flatMap(orden => orden.boletos);
        },

        // Get Orden by UID  [READ]
        getByUID: async (uid: string) => {
            return await Orden.findOne({ uid });
        },

        // Get by sorteo number and participante phone, can be a list of orders [READ]
        getByPhone: async (sorteoNumero: number, participanteTelefono: string) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            const participante = await Participante.findOne({ telefono: participanteTelefono }, { _id: 1 });
            if (!participante) throw new Error("El participante no existe");
            return await Orden.find({ sorteo: sorteoID._id, participante: participante._id });
        },

        // Get by sorteo number and boleto number, only one order can be returned [READ]    
        getBySorteoNumeroAndBoletoNumber: async (sorteoNumero: number, boletoNumber: number) => {
            const sorteoID = await Sorteo.findOne({ numero: sorteoNumero }, { _id: 1 });
            if (!sorteoID) throw new Error("El sorteo no existe");
            return await Orden.findOne({ sorteo: sorteoID._id, boletos: { $in: [boletoNumber] } });
        },

        // Set pagado by UID [UPDATE]
        setPagadoByUID: async (uid: string) => {
            return await Orden.updateOne({ uid }, { estado: "pagado" });
        },

        // Set apartado by UID [UPDATE]
        setApartadoByUID: async (uid: string) => {
            return await Orden.updateOne({ uid }, { estado: "apartado" });
        },

        // delete Orden by UID [DELETE]
        deleteByUID: async (uid: string) => {
            return await Orden.deleteOne({ uid });
        }
    },

    // ** Participante CRUD **
    Participante: {
        // Create Participante [CREATE]
        create: async (nombre: string, telefono: string, pais: string, estado: string) => {
            return await Participante.create({ nombre, telefono, pais, estado });
        },

        // Get Participante by phone [READ]
        getByPhone: async (telefono: string) => {
            return await Participante.findOne({ telefono });
        },

        // Get ID by phone [READ]
        getIDByPhone: async (telefono: string) => {
            const participante = await Participante.findOne({ telefono }, { _id: 1 });
            if (!participante) throw new Error("El participante no existe");
            return participante._id.toString();
        },

        // Get all Participantes [READ]
        getAll: async () => {
            return await Participante.find();
        },
        
        // Get Participante by ID [READ]
        getByID: async (id: string) => {
            return await Participante.findById(id);
        },

        // Change name by phone [UPDATE]
        changeNameByPhone: async (telefono: string, nombre: string) => {
            return await Participante.updateOne({ telefono }, { nombre }); 
        },  

        // Change phone by phone [UPDATE]
        changePhoneByPhone: async (telefono: string, nuevoTelefono: string) => {
            return await Participante.updateOne({ telefono }, { telefono: nuevoTelefono });
        },  

        // Change country by phone [UPDATE]
        changeCountryByPhone: async (telefono: string, nuevoPais: string) => {
            return await Participante.updateOne({ telefono }, { pais: nuevoPais });
        },  

        // Change state by phone [UPDATE]
        changeStateByPhone: async (telefono: string, nuevoEstado: string) => {
            return await Participante.updateOne({ telefono }, { estado: nuevoEstado });
        },    

        // update participante by id [UPDATE]
        updateByID: async (id: string, nombre: string, telefono: string, pais: string, estado: string) => {
            return await Participante.updateOne({ _id: id }, { nombre, telefono, pais, estado });
        },
        
        // Delete Participante [DELETE]
        delete: async (id: string) => {
            return await Participante.deleteOne({ _id: id });
        }
    },

    // ** Sistema CRUD **
    Sistema: {
        // Get all sistemas [READ]
        getAll: async () => {
            return await Sistema.find();
        },

        // Get sistema by ID [READ]
        getByID: async (id: string) => {
            return await Sistema.findById(id);
        },
        
        // Change name by ID [UPDATE]
        changeNameByID: async (id: string, nombre: string) => {
            return await Sistema.updateOne({ _id: id }, { nombre });
        },

        // Change description by ID [UPDATE]    
        changeDescriptionByID: async (id: string, descripcion: string) => {
            return await Sistema.updateOne({ _id: id }, { descripcion });
        },

        // delete Sistema by ID [DELETE]
        deleteByID: async (id: string) => { 
            return await Sistema.deleteOne({ _id: id });
        }
    }
}

/**
 * ejemplo de uso
 * 
 * const admin = await Mongo.Administrador.create("admin", "password");
 * console.log(admin);
 * 
 * const isPasswordValid = await Mongo.Administrador.verifyPassword("admin", "password");
 * console.log(isPasswordValid);
 * 
 * const admin = await Mongo.Administrador.getByNickname("admin");
 * console.log(admin);
 * 
 * 
 */ 

export default Mongo;