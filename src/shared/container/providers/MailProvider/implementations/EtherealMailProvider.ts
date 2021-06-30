import nodemailer, { Transporter } from 'nodemailer'; 
import { injectable } from "tsyringe";
import handlebars from 'handlebars';
import fs from 'fs';

import IMailProvider from "../IMailProvider";

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    })
    .catch(err => console.error(err));
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');
    const parseTemplate = handlebars.compile(templateFileContent);
    const templateHTML = parseTemplate(variables);

    const message = await this.client.sendMail({
      to,
      from: 'Rentx <noreply@rentx.com.br>',
      subject,
      html: templateHTML,
    });

    console.log('Message sent:', message.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(message));
  }

}