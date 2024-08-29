import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { IdgenModule } from '../utils/idgen/idgen.module';
import {Profile} from "../profile/entities/profile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, Profile]),
     IdgenModule,
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [TypeOrmModule],
})
export class FriendshipModule {}
