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

// Umbrales de temperatura
//const THRESHOLD_COLD = 35;  // Menor o igual a 35°C = Frío
//const THRESHOLD_HOT = 40;   // Mayor o igual a 40°C = Caluroso

//Nuevos estados:
const Insolacion = 40;
const caliente = 37;
const caluroso = 35;
const ideal = 33;
const fresco = 31;
const frio = 29;
const hipotermia = 27;



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
            /*
            if (temperatura <= THRESHOLD_COLD) {
                estado = 'frio';
            } else if (temperatura >= THRESHOLD_HOT) {
                estado = 'caluroso';
            } else {
                estado = 'normal';
            }
            */
            if (temperatura >= Insolacion) {
                console.log('Estado: Insolación');
                estado = 'Insolación';
            } else if (temperatura >= caliente) {
                console.log('Estado: Caliente');
                estado = 'Caliente';
            } else if (temperatura >= caluroso) {
                console.log('Estado: Caluroso');
                estado = 'Caluroso';
            } else if (temperatura >= ideal) {
                console.log('Estado: Ideal');
                estado = 'Ideal';
            } else if (temperatura >= fresco) {
                console.log('Estado: Fresco');
                estado = 'Fresco';
            } else if (temperatura >= frio) {
                console.log('Estado: Frío');
                estado = 'Frío';
            } else if (temperatura >= hipotermia) {
                console.log('Estado: Hipotermia');
                estado = 'Hipotermia';
            } else {
                console.log('Estado: Crítico, fuera de rango');
                estado = 'Crítico';
            }


            // Publicar el estado en el broker MQTT, estos es lo que enviamos a TSH
            client.publish('estado', `El estado es: ${estado}`);
            console.log(`Estado publicado: ${estado}`);

            // Almacenar en la base de datos
            const nuevaTemperatura = new Temperatura({ valor: temperatura, humedad, estado });
            try {
                await nuevaTemperatura.save();
                console.log(`Temperatura ${temperatura}°C y Humedad ${humedad}% almacenadas en la base de datos con estado '${estado}'`);

                // Enviar los datos al cliente WebSocket
                broadcast({
                    temperatura,
                    humedad,
                    estado
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
