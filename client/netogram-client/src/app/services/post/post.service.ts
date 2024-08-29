import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../../util/http-client-auth';
import { PostModel } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClientAuth) {}

  createPost(post: PostModel) {
    console.log('post', post);
    const formData = new FormData();
    formData.append('content', post.content);
    formData.append('uid', post.uid);
    post.imageUrls.forEach((image) => {
      formData.append('imageUrl', image);
    });
    formData.append('id', post.id.toString());
    console.log('formData', formData);

    return this.httpClient.post('post', formData);
  }

  getAllPost(pageNumber: number, limitNumber: number) {
    console.log(pageNumber, limitNumber);
    return this.httpClient.get(
      `post/all?page=${pageNumber}&limit=${limitNumber}`,
    );
  }

  getMinePost(uid: string, pageNumber: number, limitNumber: number) {
    return this.httpClient.get(
      `post?uid=${uid}&page=${pageNumber}&limit=${limitNumber}`,
    );
  }

  getById(id: bigint) {
    return this.httpClient.get(`post/${id}`);
  }

  deletePost(id: bigint, uid: string) {
    return this.httpClient.delete(`post/${id}?uid=${uid}`);
  }
}
