import nodemailer, { Transporter } from 'nodemailer'; 
import { SES } from 'aws-sdk';
import { injectable } from "tsyringe";
import handlebars from 'handlebars';
import fs from 'fs';

import IMailProvider from "../IMailProvider";

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      this.client = nodemailer.createTransport({
        SES: new SES({
          apiVersion: '2012-10-17',
          region: process.env.AWS_SES_REGION
        })
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

    await this.client.sendMail({
      to,
      from: 'Rentx <gois.jg.dev@buzzybit.com>', // real own email needed
      subject,
      html: templateHTML,
    });
  }

}