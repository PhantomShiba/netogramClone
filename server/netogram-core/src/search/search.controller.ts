import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('posts')
  async searchPosts(@Body() request: any) {
    return this.searchService.searchPosts(request.query);
  }

  @Get('person')
  async searchProfiles(@Body() request: any) {
    return this.searchService.searchProfiles(request.query);
  }

  @Get('any')
  async searchTags(@Query('q') q: string) {
    let profiles = await this.searchService.searchAny('netogram_profiles',q);
    let posts = await this.searchService.searchAny('netogram_posts',q);
    return {
      profiles: profiles,
      posts: posts
    };
  }

  @Get()
  findAll() {
    return this.searchService.getAllIndexPosts();
  }

  @Delete('posts/:id')
  async deleteIndexPost(@Param('id') id: number) {
    return this.searchService.deleteIndexPost(id);
  }

  @Get('anyOne')
  findAllUserPost(@Query('q') q: string) {
    return this.searchService.searchUserPosts(q);
  }
}
