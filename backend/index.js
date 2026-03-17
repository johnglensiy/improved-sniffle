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

// Serve built assets (e.g. /assets/*)
app.use(express.static(distDir, { index: false }));

// SPA fallback: any non-file route -> dist/index.html
app.get('*', (req, res) => {
  res.sendFile(distIndexHtml);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});