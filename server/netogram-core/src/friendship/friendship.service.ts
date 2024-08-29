import { HttpException, Injectable } from '@nestjs/common';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { Repository } from 'typeorm';
import { IdgenService } from '../utils/idgen/idgen.service';
import {Profile} from "../profile/entities/profile.entity";

@Injectable()
export class FriendshipService {
  constructor(
      private idGen: IdgenService,
  @InjectRepository(Friendship)
  private readonly repository: Repository<Friendship>,
  @InjectRepository(Profile)
  private readonly repositoryProfile: Repository<Profile>
) {}

  async checkFriendship(uid: string, friendId: string) {
    let status = await this.repository.findOne({ where: { uid, friendUid: friendId } });
    if (status != null) {
      return status;
    }else {
      return await this.repository.findOne({ where: { uid: friendId, friendUid: uid } });
    }
  }

  async create(createFriendshipDto: CreateFriendshipDto,uid: string) {

    // check if friendship already exists
    const friendship = await this.checkFriendship(createFriendshipDto.uid, createFriendshipDto.friendUid);
    if (friendship) {
      throw new HttpException('Friendship already exists', 400);
    }
    createFriendshipDto.status = 'pending';
    let newFriend = new Friendship();
    newFriend.id = this.idGen.generateId();
    newFriend.uid = uid;
    newFriend.friendUid = createFriendshipDto.friendUid;
    newFriend.status = createFriendshipDto.status;
    newFriend.createdAt = new Date().toISOString();



    // createFriendshipDto.createdAt = new Date();
    // send notification to the friend
    // this.notificationGateway.server.to(createFriendshipDto.friendUid).emit('friendRequest', createFriendshipDto);
    return await this.repository.save(newFriend);
  }

  async replyFriendship(uid: string, friendUid: string) {
    const friendship = await this.checkFriendship(uid, friendUid)
    console.log('friendship:', friendship);
    if (!friendship) {
      return friendship;
    }

    if (friendship.status === 'pending') {
      friendship.status = 'accepted';
      return await this.repository.update(friendship.id, friendship);
    }
  }

  async delete(uid1: string, friendUid: string) {
    console.log('uid:', uid1); // Log uid
    console.log('friendUid:', friendUid); // Log friendUid
    const friendship = await this.checkFriendship(uid1, friendUid);
    console.log('friendship:', friendship); // Log friendship
    if (friendship == null) {
      throw new HttpException('Friendship not found', 404);
    }
    return await this.repository.delete({ id: friendship.id });
  }
  // get all friends by uid with pagination
  async findFriendsByUid(uid: string, page: number, limit: number) {
    console.log('page', page);
    console.log('limit', limit);
    return await this.repository.find({
      where: [{ uid: uid, status: 'accepted' }, { friendUid: uid, status: 'accepted' }],
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async findFriendRequests(uid: string,page: number, limit: number) {
    return await this.repository.find({
      where: { friendUid: uid, status: 'pending' },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  // count mutual friends
  // async countMutualFriends(uid: string, friendUid: string) {
  //   // count mutual friends
  //   return await this.repository.createQueryBuilder('friendship')
  //     .innerJoin('friendship', 'f1', 'f1.uid = friendship.friendUid AND f1.friendUid = :uid', { uid })
  //     .innerJoin('friendship', 'f2', 'f2.uid = :friendUid AND f2.friendUid = friendship.uid', { friendUid })
  //     .where('friendship.uid = :uid AND friendship.friendUid = :friendUid', { uid, friendUid })
  //     .getCount();
  // }

  // async countMutualFriends(uid: string, friendUid: string): Promise<number> {
  //   const profiles = await this.repositoryProfile.createQueryBuilder('profile')
  //       .select('profile.uid')
  //       .getMany();
  //
  //   let mutualCount = 0;
  //
  //   for (const profile of profiles) {
  //     const mutualUid = profile.uid;
  //
  //     if (mutualUid !== uid && mutualUid !== friendUid) {
  //       const isFriendWithUid = await this.checkFriendship(uid, mutualUid);
  //       const isFriendWithFriendUid = await this.checkFriendship(friendUid, mutualUid);
  //
  //       if (isFriendWithUid && isFriendWithFriendUid && isFriendWithUid.status === 'accepted' && isFriendWithFriendUid.status === 'accepted') {
  //         mutualCount++;
  //       }
  //     }
  //   }
  //
  //   return mutualCount;
  // }

  async countMutualFriends(uid: string, friendUid: string): Promise<number> {
    // Get all friends of the user
    const userFriends = await this.repository.find({
      where: [
        { uid: uid, status: 'accepted' },
        { friendUid: uid, status: 'accepted' }
      ]
    });

    // Get all friends of the friend
    const friendFriends = await this.repository.find({
      where: [
        { uid: friendUid, status: 'accepted' },
        { friendUid: friendUid, status: 'accepted' }
      ]
    });

    // Extract UIDs of friends
    const userFriendUids = new Set(userFriends.map(f => f.uid === uid ? f.friendUid : f.uid));
    const friendFriendUids = new Set(friendFriends.map(f => f.uid === friendUid ? f.friendUid : f.uid));

    // Find mutual friends
    const mutualFriends = [...userFriendUids].filter(uid => friendFriendUids.has(uid));

    // Return the count of mutual friends
    return mutualFriends.length;
  }

  // async suggestFriends(uid: string, page: number, limit: number) {
  //   // get suggestion friend list based on number of mutual friends of friends
  //   return await this.repository.createQueryBuilder('friendship')
  //     .innerJoin('friendship', 'f1', 'f1.uid = friendship.friendUid')
  //     .innerJoin('friendship', 'f2', 'f2.uid = f1.friendUid AND f2.friendUid != :uid', { uid })
  //     .leftJoin('friendship', 'f3', 'f3.uid = :uid AND f3.friendUid = f2.friendUid', { uid })
  //     .where('friendship.uid = :uid', { uid })
  //     .andWhere('f3.uid IS NULL')
  //     .select('f2.friendUid', 'suggestedFriend')
  //     .addSelect('COUNT(f2.friendUid)', 'mutualFriendsCount')
  //     .groupBy('f2.friendUid')
  //     .orderBy('COUNT(f2.friendUid)', 'DESC')
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getRawMany();
  // }

  // async suggestFriends(uid: string, page: number, limit: number) {
  //   const profiles = await this.repositoryProfile.createQueryBuilder('profile')
  //       .select('profile.uid')
  //       .getMany();
  //
  //   const suggestedFriends = [];
  //
  //   for (let profile of profiles) {
  //     const suggestedUid = profile.uid;
  //
  //     if (suggestedUid !== uid) {
  //       const isFriendWithUid = await this.checkFriendship(uid, suggestedUid);
  //
  //       if (!isFriendWithUid) {
  //         const mutualCount = await this.countMutualFriends(uid, suggestedUid);
  //
  //         console.log('1')
  //         console.log(suggestedUid, mutualCount);
  //         suggestedFriends.push({
  //           suggestedFriend: suggestedUid,
  //           mutualFriendsCount: mutualCount
  //         });
  //       }
  //     }
  //   }
  //
  //   suggestedFriends.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);
  //
  //   return suggestedFriends.slice((page - 1) * limit, page * limit);
  // }

  async suggestFriends(uid: string, page: number, limit: number) {
    // Get all friends of the user
    const friends = await this.repository.find({
      where: [
        { uid: uid, status: 'accepted' },
        { friendUid: uid, status: 'accepted' }
      ]
    });

    const suggestedFriends = new Set<string>();

    // Iterate through each friend
    for (const friend of friends) {
      const friendUid = friend.uid === uid ? friend.friendUid : friend.uid;

      // Get friends of the current friend
      const friendsOfFriend = await this.repository.find({
        where: [
          { uid: friendUid, status: 'accepted' },
          { friendUid: friendUid, status: 'accepted' }
        ]
      });


      // Iterate through each friend of the friend
      for (const fof of friendsOfFriend) {
        const suggestedUid = fof.uid === friendUid ? fof.friendUid : fof.uid;

        const uidFriend = await this.checkFriendship(uid, suggestedUid);
        const isNotPending = uidFriend == null || uidFriend.status !== 'pending';

        if (suggestedUid !== uid && isNotPending && !friends.some(f => (f.uid === suggestedUid || f.friendUid === suggestedUid))) {
          suggestedFriends.add(suggestedUid);
        }
      }
    }
    // Convert Set to Array and paginate the results
    const uniqueSuggestedFriends = [];

    for (const suggestedUid of suggestedFriends) {
      const mutualFriendsCount = await this.countMutualFriends(uid, suggestedUid);
      uniqueSuggestedFriends.push({
        suggestedFriend: suggestedUid,
        mutualFriendsCount: mutualFriendsCount
      });
    }
    uniqueSuggestedFriends.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount)

    const paninatedSuggestedFriends = uniqueSuggestedFriends.slice((page - 1) * limit, page * limit);

    return paninatedSuggestedFriends;
  }


}
