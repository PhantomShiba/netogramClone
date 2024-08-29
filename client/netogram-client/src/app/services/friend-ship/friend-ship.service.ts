import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../../util/http-client-auth';
import { FriendshipModel } from '../../models/friendship.model';

@Injectable({
  providedIn: 'root',
})
export class FriendShipService {
  constructor(private httpClient: HttpClientAuth) {}

  getFriendList(uid: string, page: number, limit: number) {
    return this.httpClient.get(`friendship/${uid}?page=${page}&limit=${limit}`);
  }

  addFriend(friendShipModel: FriendshipModel) {
    return this.httpClient.post('friendship', friendShipModel);
  }

  replyFriendRequest(friendShipModel: FriendshipModel) {
    return this.httpClient.put('friendship/reply', friendShipModel);
  }

  getFriendshipStatus(friendUid: string) {
    return this.httpClient.get(`friendship/status/${friendUid}`);
  }

  getFriendRequestList(uid: string, page: number, limit: number) {
    return this.httpClient.get(`friendship/friend-request/${uid}?page=${page}&limit=${limit}`);
  }

  getMutualFriends(uid: string, friendUid: string){
    return this.httpClient.get(`friendship/mutuals/${uid}/${friendUid}`);
  }

  getSuggestedFriends(uid: string, page:number, limit:number){
    return this.httpClient.get(`friendship/suggest/${uid}?page=${page}&limit=${limit}`);
  }

  unfriend( friendUid: string,uid: string) {
    return this.httpClient.delete(`friendship/unfriend/${friendUid}/${uid}`);
  }
}
