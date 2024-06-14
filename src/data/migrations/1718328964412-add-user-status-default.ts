import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserStatusDefault1718328964412 implements MigrationInterface {
    name = 'AddUserStatusDefault1718328964412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT '{"ACTIVE":"ACTIVE","INACTIVE":"INACTIVE"}'`);
    }

}
