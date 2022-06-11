export type ConnectionHandler = {
  onConnectionAttempt?: () => void;
  onConnectionError?: (error: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onMessage?: (type: string, payload: any) => void;
};

export const createConnection = (handler: ConnectionHandler) => {
  let isOpen = false;
  let isConnected = false;
  let socket: WebSocket | undefined;

  let requestCounter = 0;
  let keepaliveInterval: ReturnType<typeof setInterval> | undefined = undefined;
  const messageHandlers = new Map<number, { resolve: (response: any) => void; reject: (err: Error) => void; }>();

  let onClosed: (() => void) | undefined = undefined;

  const createSocket = () => new Promise<void>(resolve => {
    handler.onConnectionAttempt?.();

    socket = new WebSocket(
      `${ window.location.protocol === 'https:' ? 'wss' : 'ws' }://${ window.location.host }/socket`
    );

    socket.onopen = () => {
      isConnected = true;
      handler.onConnected?.();
    };

    socket.onmessage = event => {
      const { id, type, payload, result } = JSON.parse(event.data);
      if (id !== undefined) {
        const messageHandler = messageHandlers.get(id);
        messageHandlers.delete(id);
        if (messageHandler) {
          messageHandler.resolve(result);
        }
      } else {
        handler.onMessage?.(type, payload);
      }
    };

    socket.onerror = error => {
      handler.onConnectionError?.(error);
    };

    socket.onclose = onClosed = () => {
      isConnected = false;
      socket = undefined;
      resolve();
      handler.onDisconnected?.();
    };
  });

  const send = async (type: string, payload?: any): Promise<any> => {
    if (!isConnected) {
      throw new Error('Connection is not open');
    }
    ++requestCounter;
    socket!.send(JSON.stringify({
      id: requestCounter,
      type,
      payload,
    }));
    return await new Promise((resolve, reject) => messageHandlers.set(requestCounter, { resolve, reject }));
  };

  return {
    get isOpen() {
      return isOpen;
    },
    get isConnected() {
      return isConnected;
    },
    send,
    open: () => {
      if (isOpen) {
        return;
      }
      isOpen = true;
      keepaliveInterval = setInterval(async () => {
        if (isConnected) {
          const res = await Promise.race([
            send('keepalive'),
            new Promise(resolve => setTimeout(() => resolve('timeout'), 1000)),
          ]);
          if (res === 'timeout') {
            onClosed?.();
            socket?.close();
            socket = undefined;
          }
        }
      }, 500);
      (async () => {
        while (isOpen) {
          await createSocket();

          for (const { reject } of messageHandlers.values()) {
            reject(new Error('socket closed'));
          }
          messageHandlers.clear();

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      })();
    },
    close: () => {
      if (keepaliveInterval !== undefined) {
        clearInterval(keepaliveInterval);
      }
      isOpen = false;
      socket?.close();
    },
  };
};

export type Connection = ReturnType<typeof createConnection>;
