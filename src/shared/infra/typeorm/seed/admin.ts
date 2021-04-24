import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import createConnection from '../index';

async function create() {
  // because we are using with docker, sometimes we need to use 'database' as defined earlier
  // or localhost, the actual host name;
  const connection = await createConnection('localhost');

  const id = uuid();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
      values('${id}', 'admin', 'admin@rentx.dev', '${password}', 'XXXXXX', true, 'now()')
    `
  );

  await connection.close();
}

create().then(() => console.log('Admin user created! '));
