import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUserDeleteUsername1617948967300 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('users', 'username');

  await queryRunner.changeColumn('users', 'email', new TableColumn({
    name: 'email',
    type: 'varchar',
    isUnique: true
  }));
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn('users', new TableColumn({
    name: 'username',
    type: 'varchar',
    isUnique: true
  }));

  await queryRunner.changeColumn('users', 'email', new TableColumn({
    name: 'email',
    type: 'varchar'
  }));
}

}
