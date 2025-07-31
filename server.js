// Import necessary modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Make sure socket.io is installed in your package.json

const app = express();
const server = http.createServer(app);

// Determine if WebSockets should be enabled based on the ENABLE_WEBSOCKETS environment variable.
// If the variable is set to 'true', WebSockets will be active. Otherwise, they will be dormant.
const enableWebsockets = process.env.ENABLE_WEBSOCKETS === 'true';

let io; // Declare the Socket.IO server instance here so it's accessible globally if needed

if (enableWebsockets) {
    console.log('Socket.IO server is being enabled.');
    // Initialize Socket.IO server and attach it to the HTTP server
    io = new Server(server, {
        cors: {
            // IMPORTANT: This MUST be the public URL of your Render Frontend Static Site.
            // This allows your frontend to connect to the backend's WebSocket.
            origin: "https://e-g-hilbert-frontend.onrender.com",
            methods: ["GET", "POST"] // Allowed HTTP methods for CORS preflight requests
        }
    });

    // Handle incoming Socket.IO connections
    io.on('connection', (socket) => {
        console.log('a user connected');

        // Listen for messages from GOS-427 from the frontend
        socket.on('message_from_gos427', (data) => {
            console.log('Message from GOS-427:', data.message);
            // Relay the message to all connected clients (including GPT Agent if implemented similarly)
            io.emit('relay_from_gos427', data); 
        });

        // Listen for messages from GPT Agent from the frontend
        socket.on('message_from_gpt', (data) => {
            console.log('Message from GPT Agent:', data.message);
            // Relay the message to all connected clients (including GOS-427 if implemented similarly)
            io.emit('relay_from_gpt', data);
        });

        // Handle client disconnection
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
} else {
    // Log that WebSockets are dormant if the environment variable is not set to 'true'
    console.log('Socket.IO server is currently dormant (disabled via ENABLE_WEBSOCKETS environment variable).');
}

// Define a basic Express route for standard HTTP requests (e.g., for a health check or browser access)
app.get('/', (req, res) => {
    res.send('Hilbert Mesh Backend is Running!');
});

// Define the port for the server to listen on. Render automatically provides this via process.env.PORT.
const PORT = process.env.PORT || 8080; // Fallback to 8080 for local development

// Start the HTTP server (which Socket.IO will use if enabled)
server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
