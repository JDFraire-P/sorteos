// models/redis/boletos.ts
// Guarda los boletos seleccionados temporalmente.
// Key = "boleto:{numerosorteo}:{numeroboleto}" → Valor: sesión anónima del participante.
import redis from '@/lib/redis';


export const KEY_BOLETO_SELECCIONADO = "boleto:{sorteo}:{boleto}";
export const SELECCION_TIEMPO_EXPIRACION = 60 * 10; // 10 minutos


export class Boleto {
    sorteo: string;
    boleto: string;
    session: string;
    key: string;

    constructor(sorteo: string, boleto: string, session: string) {
        this.sorteo = sorteo;
        this.boleto = boleto;
        this.session = session;
        this.key = KEY_BOLETO_SELECCIONADO.replace("{sorteo}", this.sorteo).replace("{boleto}", this.boleto);
        redis.set(this.key, session, { ex: SELECCION_TIEMPO_EXPIRACION });
    }

    // eliminar el boleto de redis y el objeto
    async eliminar() {
        // eliminar el boleto de redis y manenjar la respuesta
        const respuesta = await redis.del(this.key);

        // si la respuesta es 1, el boleto fue eliminado
        if (respuesta === 1) {
            // destruir el objeto
            this.sorteo = "";
            this.boleto = "";
            this.session = "";
            this.key = "";
        }
        return respuesta;
    }
}
