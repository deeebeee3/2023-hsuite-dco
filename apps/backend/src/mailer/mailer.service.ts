import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  public viewEngineOptions: {
    partialsDir: string;
    defaultLayout: string;
  };

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<Record<string, string>>('mailer').host,
      port: configService.get<Record<string, string>>('mailer').port,
      secure: false,
      auth: {
        user: configService.get<Record<string, string>>('mailer').username,
        pass: configService.get<Record<string, string>>('mailer').password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.hbs',
          partialsDir: path.resolve('./src/views/partials'),
          layoutsDir: path.resolve('./src/views/layouts'),
          defaultLayout: 'main.hbs',
        },
        viewPath: path.resolve('./src/views'),
        extName: '.hbs',
      }),
    );
  }

  async sendMail(
    to: string,
    subject: string,
    template?: string,
    context?: Record<string, any>,
    attachments?: any[],
  ) {
    await this.transporter.sendMail({
      from: this.configService.get<Record<string, string>>('mailer')
        .fromAddress,
      to: to,
      subject: subject,
      template,
      context,
      attachments,
    });
  }
}
