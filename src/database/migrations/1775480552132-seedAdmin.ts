import { hash, verify } from 'argon2';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdmin1775480552132 implements MigrationInterface {
  name = 'SeedAdmin1775480552132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await hash('password');
    await queryRunner.query(
      `INSERT INTO "users"
         ("name", "email", "password", "roles", "status", "balance")
       VALUES
         (
           'Benjamin',
           'benfrank@protonmail.com',
           '${passwordHash}',
           '{admin, client}', -- запис для масиву в Postgres
           'active',
           0
         )
         ON CONFLICT ("email") DO NOTHING`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE email = 'benfrank@protonmail.com'`,
    );
  }
}
