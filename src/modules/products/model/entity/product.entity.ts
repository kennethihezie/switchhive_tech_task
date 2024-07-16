import { User } from "../../../users/model/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    userId: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    imageUrl: string

    @ManyToOne(() => User, user => user.products)
    user: User

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date
}