import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BidsService } from '@/modules/bids/bids.service';
import { AuctionsService } from '@/modules/auctions/auctions.service';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '@/modules/items/item.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
  namespace: '/auction',
})
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private bidsService: BidsService,
    private auctionsService: AuctionsService,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      this.connectedClients.set(client.id, payload.sub);

      console.log(`Cliente conectado: ${client.id} - Usuário: ${payload.sub}`);

      // Enviar estado inicial do leilão
      const activeAuctions = await this.auctionsService.findActive();
      client.emit('auctions:active', activeAuctions);
    } catch (error) {
      console.error('Erro na autenticação WebSocket:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedClients.get(client.id);
    this.connectedClients.delete(client.id);
    console.log(`Cliente desconectado: ${client.id} - Usuário: ${userId}`);
  }

  @SubscribeMessage('auction:join')
  async handleJoinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() auctionId: string,
  ) {
    client.join(`auction:${auctionId}`);
    console.log(`Cliente ${client.id} entrou no leilão ${auctionId}`);

    const auction = await this.auctionsService.findOne(auctionId);

    console.log('Auction data:', {
      id: auction.id,
      currentItemId: auction.currentItemId,
      itemsCount: auction.items?.length,
      itemIds: auction.items?.map(i => i.id)
    });

    // Find current item
    let currentItem = auction.items?.find(item => item.id === auction.currentItemId);

    // Fallback: if currentItem is not found in relations but ID exists, fetch it directly
    if (!currentItem && auction.currentItemId) {
      console.log('Current item not found in relations, fetching directly:', auction.currentItemId);
      currentItem = await this.itemRepository.findOne({ where: { id: auction.currentItemId } });
    }

    console.log('Current item found:', currentItem ? currentItem.id : 'NULL');

    // Get bids for current item
    const bids = currentItem ? await this.bidsService.getItemBids(currentItem.id) : [];

    client.emit('auction:state', {
      auction,
      currentItem: currentItem || null,
      bids,
      endTime: auction.currentItemEndTime || null,
    });
  }

  @SubscribeMessage('auction:leave')
  handleLeaveAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() auctionId: string,
  ) {
    client.leave(`auction:${auctionId}`);
    console.log(`Cliente ${client.id} saiu do leilão ${auctionId}`);
  }

  @SubscribeMessage('item:join')
  async handleJoinItem(
    @ConnectedSocket() client: Socket,
    @MessageBody() itemId: string,
  ) {
    client.join(`item:${itemId}`);
    console.log(`Cliente ${client.id} entrou no item ${itemId}`);

    const bids = await this.bidsService.getItemBids(itemId);
    client.emit('item:bids', bids);
  }

  // Métodos para emitir eventos do servidor
  notifyNewBid(itemId: string, auctionId: string, bid: any) {
    this.server.to(`item:${itemId}`).emit('bid:new', bid);
    this.server.to(`auction:${auctionId}`).emit('item:updated', {
      itemId,
      currentValue: bid.amount,
      highestBidder: bid.user.name,
    });
  }

  notifyBidCancelled(itemId: string, auctionId: string, data: any) {
    this.server.to(`item:${itemId}`).emit('bid:cancelled', data);
    this.server.to(`auction:${auctionId}`).emit('item:updated', data);
  }

  notifyTimerExtension(auctionId: string, itemId: string, newEndTime: Date) {
    this.server.to(`auction:${auctionId}`).emit('timer:extended', {
      itemId,
      newEndTime,
    });
  }

  notifyItemChanged(auctionId: string, itemId: string) {
    this.server.to(`auction:${auctionId}`).emit('item:changed', { itemId });
  }

  notifyAuctionEnded(auctionId: string) {
    this.server.to(`auction:${auctionId}`).emit('auction:ended');
  }

  notifyUserOutbid(userId: string, itemId: string, itemName: string) {
    // Encontrar socket do usuário
    for (const [socketId, uid] of this.connectedClients.entries()) {
      if (uid === userId) {
        this.server.to(socketId).emit('user:outbid', {
          itemId,
          itemName,
          message: 'Você foi superado!',
        });
      }
    }
  }

  // Timer update - emitir a cada segundo
  notifyTimerUpdate(auctionId: string, itemId: string, remainingSeconds: number) {
    this.server.to(`auction:${auctionId}`).emit('timer:update', {
      itemId,
      remainingSeconds,
    });
  }
}
