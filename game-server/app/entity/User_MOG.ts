import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn} from "typeorm";

@Entity()
export class User_MOG {

    @ObjectIdColumn()
    id: number;

    @Column()
    uid: number;

    @Column()
    name: string;

    @Column()
    sex: string; // 性别

    @Column()
    avatar: number; // 头像

    @Column()
    coin: number; // 金币(分)

}
