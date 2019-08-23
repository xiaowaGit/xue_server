import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn} from "typeorm";

@Entity()
export class Account_MOG {

    @ObjectIdColumn()
    id: number;

    @Column()
    account: string;

    @Column()
    password: string;

    @Column()
    uid: number;

}
