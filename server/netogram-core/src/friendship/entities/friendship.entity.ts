import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Friendship {
  @PrimaryColumn({ type: 'bigint' })
  id : number;

  @Column()
  friendUid : string;

  @Column()
  uid : string;

  @Column()
  status : string;

  @Column({ type: 'timestamp'})
  createdAt : string;

}
