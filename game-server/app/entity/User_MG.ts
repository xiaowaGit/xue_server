import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn} from "typeorm";

@Entity()
export class User_MG {

    @ObjectIdColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
