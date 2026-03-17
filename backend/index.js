import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const distDir = join(__dirname, '..', 'dist');
const distIndexHtml = join(distDir, 'index.html');
const PORT = Number(process.env.PORT ?? 3000);

const ROUND_DURATION_MS = 60 * 1000;
let currentEndTime;
let adminSocketId = null;

// Serve built assets (e.g. /assets/*)
app.use(express.static(distDir, { index: false }));

// SPA fallback: any non-file route -> dist/index.html
app.get('*', (req, res) => {
  res.sendFile(distIndexHtml);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.emit('round-start', { endTime: currentEndTime })
    if (!adminSocketId) {
        adminSocketId = socket.id;
        socket.emit('set-admin');
    }

    // Next person to connect becomes admin, could be queue
    socket.on('disconnect', () => {
        if (socket.id === adminSocketId) {
            adminSocketId = null;
        }
    });

    socket.on('submit-guess', (guess) => {
        console.log(guess)
        io.emit('broadcast-guess', guess)
    });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

function startRound() {
    currentEndTime = Date.now() + ROUND_DURATION_MS;
    console.log('starting round')
    io.emit('round-start', { endTime: currentEndTime });

    setTimeout(() => {
        io.emit('round-end');
        // Display scores
    }, ROUND_DURATION_MS);
}

startRound();