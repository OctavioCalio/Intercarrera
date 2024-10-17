const mqtt = require('mqtt');
const mongoose = require('mongoose');
const WebSocket = require('ws');

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
const wss = new WebSocket.Server({ port: 8080 });

// Función para enviar datos a todos los clientes conectados por WebSocket
function broadcast(data) {
    console.log('Enviando datos a todos los clientes conectados: ', data);
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

    client.subscribe('ete', (err) => {
        if (!err) {
            console.log('Suscrito al tema prueba');
        }
    });
});

let estadoActual = null;
let vidaActual = 5;
let intervaloVida = null;

client.on('message', async (topic, message) => {
    if (topic === 'ete') {
        const msgString = message.toString().trim();

        try {
            const data = JSON.parse(msgString);
            const temperatura = parseFloat(data.temperatura);
            const humedad = parseFloat(data.humedad);

            if (isNaN(temperatura) || isNaN(humedad)) {
                console.error(`Mensaje recibido no es un número válido: '${msgString}'`);
                return;
            }

            console.log(`Temperatura recibida: ${temperatura}°C, Humedad recibida: ${humedad}%`);

            let nuevoEstado;
            if (temperatura > 40 || temperatura < 25) {
                nuevoEstado = 'Muerto';
            } else if (temperatura >= rangosTemperatura.caluroso.min && temperatura <= rangosTemperatura.caluroso.max) {
                nuevoEstado = 'Caluroso';
            } else if (temperatura >= rangosTemperatura.frio.min && temperatura <= rangosTemperatura.frio.max) {
                nuevoEstado = 'Frío';
            } else if (temperatura >= rangosTemperatura.ideal.min && temperatura <= rangosTemperatura.ideal.max) {
                nuevoEstado = 'Ideal';
            }

            // Actualizamos el estado si cambia, pero no reiniciamos la vida
            if (nuevoEstado !== estadoActual) {
                estadoActual = nuevoEstado;
                clearInterval(intervaloVida); // Reiniciar el intervalo si el estado cambia
                intervaloVida = setInterval(chequearVida, 10000); // Chequear vida cada 10 segundos
            }

            broadcast({
                temperatura,
                humedad,
                estado: estadoActual,
                vida: vidaActual
            });

            client.publish('estado', `El estado es: ${estadoActual}`);
            console.log(`Estado publicado en MQTT: ${estadoActual}`);

            const nuevaTemperatura = new Temperatura({ valor: temperatura, humedad, estado: estadoActual });
            await nuevaTemperatura.save();
            console.log(`Temperatura ${temperatura}°C y Humedad ${humedad}% almacenadas en la base de datos con estado '${estadoActual}'`);

        } catch (error) {
            console.error(`Error al parsear el mensaje: ${msgString}`, error);
        }
    }
});

function chequearVida() {
    if (estadoActual === 'Caluroso' || estadoActual === 'Frío') {
        vidaActual--;
        console.log(`Vida disminuida a: ${vidaActual}`);
        if (vidaActual <= 0) {
            estadoActual = 'Muerto';
            vidaActual = 0;
            clearInterval(intervaloVida);
            console.log('Estado actual: Muerto');
        }
        broadcast({
            estado: estadoActual,
            vida: vidaActual
        });
    } else if (estadoActual === 'Ideal') {
        console.log('Estado ideal, la vida no disminuye.');
    }
}

client.on('error', (error) => {
    console.error('Error en la conexión MQTT:', error);
});
