import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroup } from 'src/graphql.schema';
import { Group } from './group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  async findAll() {
    return this.groupsRepository.find();
  }

  create(input: CreateGroup) {
    const group = this.groupsRepository.save(input);
    return group;
  }
}
