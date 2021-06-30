import IMailProvider from "../IMailProvider";
import { v4 as uuid} from 'uuid';

interface IMessage {
  id: string,
  to: string;
  subject: string;
  variables: any;
  path: string;
}

export default class MailProviderInMemory implements IMailProvider {
  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    const id = uuid();
    const message = {
      id,
      to,
      subject,
      variables,
      path
    };
    
    console.table(message);
  }

}