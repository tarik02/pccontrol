import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';
import { WebSocketServer } from 'ws';

import { appRouter } from '@/server/routers/_app';

export const socket: NextWebSocketHandler = (client, req) => {
    const wss = new WebSocketServer({ noServer: true });
    applyWSSHandler({ wss, router: appRouter });
    wss.emit('connection', client, req);
};

const handler: NextApiHandler = (req, res) => {
    res.status(426).send('Upgrade Required');
};

export default handler;
