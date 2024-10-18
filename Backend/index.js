// Importar las dependencias necesarias
const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cors = require('cors');

// Configuración del servidor Express
const app = express();
const port = 3001;

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(express.json());

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

// Variables de estado
let estadoActual = null;
let vidaActual = 5; // Vida inicial
let intervaloVida = null;
let temperaturaActual = null;

// Función para enviar datos a todos los clientes conectados por WebSocket
function broadcast(data) {
    console.log('Enviando datos a todos los clientes conectados: ', data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function actualizarTemperatura(nuevaTemperatura) {
    temperaturaActual = nuevaTemperatura;
    console.log(`Temperatura actualizada a: ${temperaturaActual}°C`);
}


function obtenerTemperatura() {
    return temperaturaActual;
}


// WebSocket: Conexión inicial
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

// Nueva ruta para incrementar la vida
app.post('/curar', (req, res) => {
    const { vida } = req.body; // Extraer la vida del cuerpo de la solicitud

    // Validar que la vida es un número y está en un rango válido
    if (typeof vida !== 'number' || vida <= 0) {
        return res.status(400).json({ error: 'Cantidad de vida no válida.' });
    }

    vidaActual = Math.min(5, vidaActual + vida); // Incrementar vida actual sin exceder 5
    console.log(`Vida incrementada a: ${vidaActual}`);

    const temperatura = obtenerTemperatura(); // Obtener la temperatura actual
    console.log(`Temperatura al curar: ${temperatura}°C`);

    broadcast({
        estado: estadoActual,
        vida: vidaActual,
        temperatura
    });

    res.status(200).json({ message: `Vida incrementada a ${vidaActual}` });
});

app.post('/revivir', (req, res) => {
    // Solo se puede revivir si el estado actual es "Muerto" y la vida está en 0
    if (estadoActual !== 'Muerto' || vidaActual > 0) {
        return res.status(400).json({ error: 'No se puede revivir porque el estado no es "Muerto".' });
    }

    // Restaurar la vida a 5 y cambiar el estado a "Ideal"
    vidaActual = 5;
    estadoActual = 'Ideal';

    console.log('El sistema ha sido revivido. Vida restaurada a 5 y estado cambiado a "Ideal".');

    const temperatura = obtenerTemperatura(); // Obtener la temperatura actual
    console.log(`Temperatura al revivir: ${temperatura}°C`);


    // Enviar actualización a los clientes WebSocket
    broadcast({
        estado: estadoActual,
        vida: vidaActual,
        temperatura
    });

    res.status(200).json({ message: 'Sistema revivido con vida completa y estado "Ideal".' });
});

// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

// Conexiones MQTT
client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    client.subscribe('ete', (err) => {
        if (!err) {
            console.log('Suscrito al tema prueba');
        }
    });
});

// Manejar los mensajes de MQTT




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

            // Actualizamos el estado si cambia
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


            actualizarTemperatura(temperatura);
            console.log('Temperatura actualizada en constante a: ' + temperatura);	

            

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
       
        const temperatura = obtenerTemperatura(); // Obtener la temperatura actual
        console.log(`Temperatura al chequear: ${temperatura}°C`);
       
        broadcast({
            estado: estadoActual,
            vida: vidaActual,
            temperatura
        });
    } else if (estadoActual === 'Ideal') {
        console.log('Estado ideal, la vida no disminuye.');
    }
}

// Manejo de errores de MQTT
client.on('error', (error) => {
    console.error('Error en la conexión MQTT:', error);
});
