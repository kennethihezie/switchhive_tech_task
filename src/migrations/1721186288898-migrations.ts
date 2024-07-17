import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1721186288898 implements MigrationInterface {
    name = 'Migrations1721186288898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "refreshToken"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "refreshToken" DROP NOT NULL
        `);
    }

}
