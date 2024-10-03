import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

interface Options {
  server: Server;
  path?: string;  //ws
}

export class WssService {

  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: Options) {
      const { server, path = '/ws'} = options;

      this.wss = new WebSocketServer({ server, path });
      this.start();
  }

  static get instance(): WssService {
    if (!WssService._instance) {
      throw 'WssService no inicializado';
    }

    return WssService._instance;
  }

  static initWss(options: Options) {
    try {
      WssService._instance = new WssService(options);

      console.log('instancia de wss creada')
    } catch (error) {
      console.log(error)
    }
  }

  public sendMessage(type: string, payload: Object) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    })
  }

  public start() {
    this.wss.on('connection', (ws: WebSocket) =>{
      console.log('Cliente Conectado');

      ws.on('close', () => console.log('Cliente desconectado'));
    })
  }


}



