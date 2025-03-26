import Pusher from "pusher";
import dotenv from "dotenv";
import path from "path";

// Ensure dotenv is configured with the correct path
dotenv.config({ 
    path: path.resolve(process.cwd(), '.env.local') 
});

// Configuración de Pusher (servidor)
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: process.env.PUSHER_TLS === 'true'
});

// Exportar el cliente de Pusher
export default pusher;