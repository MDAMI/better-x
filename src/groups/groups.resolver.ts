import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GroupsService } from './groups.service';
import { CreateGroup, Group } from 'src/graphql.schema';

@Resolver('Group')
export class GroupsResolver {
  constructor(private groupsService: GroupsService) {}

  @Query()
  async getGroups(): Promise<Group[]> {
    return this.groupsService.findAll();
  }

  @Mutation()
  async createGroup(@Args('input') input: CreateGroup): Promise<Group> {
    return this.groupsService.create(input);
  }
}
