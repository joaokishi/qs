import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendOutbidNotification(
    userEmail: string,
    userName: string,
    itemName: string,
    newBidAmount: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: userEmail,
        subject: 'Você foi superado no leilão!',
        html: `
          <h2>Olá, ${userName}!</h2>
          <p>Você foi superado no item <strong>${itemName}</strong>.</p>
          <p>Novo lance: <strong>R$ ${newBidAmount.toFixed(2)}</strong></p>
          <p>Acesse o leilão para dar um novo lance!</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }

  async sendWonNotification(
    userEmail: string,
    userName: string,
    itemName: string,
    winningBid: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: userEmail,
        subject: 'Parabéns! Você arrematou um item!',
        html: `
          <h2>Parabéns, ${userName}!</h2>
          <p>Você arrematou o item <strong>${itemName}</strong>!</p>
          <p>Valor final: <strong>R$ ${winningBid.toFixed(2)}</strong></p>
          <p>Em breve entraremos em contato com as instruções de pagamento e entrega.</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }

  async sendAuctionStartNotification(
    userEmail: string,
    userName: string,
    auctionTitle: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: userEmail,
        subject: 'Leilão iniciado!',
        html: `
          <h2>Olá, ${userName}!</h2>
          <p>O leilão <strong>${auctionTitle}</strong> acaba de começar!</p>
          <p>Acesse agora e participe!</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }

  async sendBulkNotification(emails: string[], subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        bcc: emails,
        subject,
        html,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail em lote:', error);
    }
  }
}
