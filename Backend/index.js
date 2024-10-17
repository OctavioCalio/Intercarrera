const mqtt = require('mqtt');
const mongoose = require('mongoose');
const WebSocket = require('ws'); // Agregamos el paquete WebSocket

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://rabbiafacundo:FACUNDO@cluster0.yy82i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

// Definir el esquema y modelo
const temperaturaSchema = new mongoose.Schema({
    valor: { type: Number, required: true }, // Temperatura
    humedad: { type: Number, required: true }, // Humedad
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now }  // Timestamp por defecto
});

const Temperatura = mongoose.model('Temperatura', temperaturaSchema);

// Conectar al broker MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com');

const rangosTemperatura = {
    ideal: { min: 32, max: 34 },
    caluroso: { min: 34, max: 40 },
    frio: { min: 25, max: 32 },
};
// Crear el servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 }); // Creamos un servidor WebSocket en el puerto 8080

// Función para enviar datos a todos los clientes conectados por WebSocket
function broadcast(data) {
    console.log('Enviando datos a todos los clientes conectados: ', data); //control
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// WebSocket: Conexión inicial
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    client.subscribe('prueba', (err) => {
        if (!err) {
            console.log('Suscrito al tema prueba');
        }
    });
});

let intervaloVida

client.on('message', async (topic, message) => {
    if (topic === 'prueba') {
        const msgString = message.toString().trim();

        try {
            // Parsear el mensaje JSON
            const data = JSON.parse(msgString);
            const temperatura = parseFloat(data.temperatura); // Extraer la temperatura
            const humedad = parseFloat(data.humedad); // Extraer la humedad

            if (isNaN(temperatura) || isNaN(humedad)) {
                console.error(`Mensaje recibido no es un número válido: '${msgString}'`);
                return;
            }

            console.log(`Temperatura recibida: ${temperatura}°C, Humedad recibida: ${humedad}%`);

            // Determinar el estado de la temperatura
            let estado;

            if (temperatura > 40 || temperatura < 25) {
                console.log('Estado: Muerto');
                estado = 'Muerto';
            } else if (temperatura >= rangosTemperatura.caluroso.min && temperatura <= rangosTemperatura.caluroso.max) {
                console.log('Estado: Caluroso');
                estado = 'Caluroso';
            } else if (temperatura >= rangosTemperatura.frio.min && temperatura <= rangosTemperatura.frio.max) {
                console.log('Estado: Frío');
                estado = 'Frío';
            } else if (temperatura >= rangosTemperatura.ideal.min && temperatura <= rangosTemperatura.ideal.max) {
                console.log('Estado: Ideal');
                estado = 'Ideal';
            }


            let vida;
            if (estado === 'Muerto') {
                vida = 0;
            } else if (estado === 'Caluroso') {
                vida = 4;
            } else if (estado === 'Frío') {
                vida = 4;
            } else if (estado === 'Ideal') {
                vida = 5;
            }
            console.log('Mandando vida desde el back: ' + vida)




            if (!intervaloVida) {

                intervaloVida = setInterval(() => {
                    if (vida < 5 && vida >= 0) {
                        vida--;
                        console.log(`Vida actual: ${vida}`);
                        if (vida === 0) {
                            estado = 'Muerto';
                            console.log('Estado actual: Muerto');
                            clearInterval(intervaloVida);
                            intervaloVida = null;
                        }
                    }

                    broadcast({
                        temperatura,
                        humedad,
                        estado,
                        vida       //mandamos vida por websocket al front
                    });


                }, 10000);

            }
            console.log(`Vida actual: ${vida}`);

            console.log(`Estado actual: ${estado}`);

            // Enviar los datos al cliente WebSocket

            // Publicar el estado en el broker MQTT, estos es lo que enviamos a TSH
            client.publish('estado', `El estado es: ${estado}`);
            console.log(`Estado publicado en MQTT: ${estado}`);

            // Almacenar en la base de datos
            const nuevaTemperatura = new Temperatura({ valor: temperatura, humedad, estado });
            try {
                await nuevaTemperatura.save();
                console.log(`Temperatura ${temperatura}°C y Humedad ${humedad}% almacenadas en la base de datos con estado '${estado}'`);

                // Enviar los datos al cliente WebSocket
                broadcast({
                    temperatura,
                    humedad,
                    estado,
                    vida       //mandamos vida por websocket al front
                });
            } catch (error) {
                console.error('Error al almacenar la temperatura en la base de datos:', error);
            }
        } catch (error) {
            console.error(`Error al parsear el mensaje: ${msgString}`, error);
        }
    }
});

client.on('error', (error) => {
    console.error('Error en la conexión MQTT:', error);
});
