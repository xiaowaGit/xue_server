import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn} from "typeorm";

@Entity()
export class Recharge_Log_SQL {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uid: number;

    @Column()
    add_coin: number; // 充值/扣款金额

    @Column()
    stamp: number;   // 时间
}
