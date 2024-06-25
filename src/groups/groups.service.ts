import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroup } from 'src/graphql.schema';
import { Group as GroupEntity } from './group.entity';
import { Group as GroupResponse } from 'src/graphql.schema';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,
  ) {}

  async findAll(): Promise<GroupResponse[]> {
    const groups = await this.groupsRepository.find({
      relations: {
        userIds: true,
        groupIds: true,
      },
    });
    const entities: GroupResponse[] = groups.map((group) =>
      this.toResponse(group),
    );
    return entities;
  }

  async create(input: CreateGroup): Promise<GroupResponse> {
    const users: User[] = input.userIds.map((userId) => {
      const user = new User();
      user.id = userId;
      return user;
    });

    const group: GroupEntity = await this.groupsRepository.save({
      id: uuidv4(),
      userIds: users,
    });

    try {
      await this.groupsRepository
        .createQueryBuilder()
        .relation(GroupEntity, 'groupIds')
        .of(group)
        .add(input.groupIds);
    } catch (error: any) {
      this.groupsRepository
        .createQueryBuilder()
        .delete()
        .from(GroupEntity)
        .where('id = :id', { id: group.id })
        .execute();
      throw new BadRequestException('Group does not exist');
    }

    const groupResponse: GroupResponse = this.toResponse(
      await this.groupsRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.userIds', 'user')
        .leftJoinAndSelect('group.groupIds', 'children')
        .where('group.id = :id', { id: group.id })
        .getOne(),
    );
    return groupResponse;
  }

  async containsUserId(searchUser: string, userIds: string[]) {
    const userEntities: GroupEntity[] =
      await this.groupsRepository.manager.query(
        `
        SELECT *
          FROM postgres.public.user u
         WHERE u.id = ANY($1::VARCHAR[])
           AND u.type = 'User'
      `,
        [userIds],
      );

    const users: string[] = userEntities.map((user) => user.id);

    if (users.includes(searchUser)) {
      return true;
    }

    const childUsers: string[] = await this.groupsRepository.manager
      .query(
        `
      WITH RECURSIVE grouptree (groupId, link) AS (
        SELECT u.id, gl."userId_2"
          FROM postgres.public.user u
          JOIN user_group_ids_user gl ON u.id = gl."userId_1"
         WHERE u.id = ANY($1::VARCHAR[])
           AND u.type = 'Group'
         UNION ALL
        SELECT g.groupid, gl2."userId_2"
          FROM grouptree g
          JOIN user_group_ids_user gl2 ON g.link = gl2."userId_1"
      )
      SELECT ul."userId_2" AS id
        FROM grouptree gt
        JOIN user_user_ids_user ul ON ul."userId_1" = gt.link
      `,
        [userIds],
      )
      .then((userArray: any[]) => userArray.map((user) => user.id));

    if (childUsers.includes(searchUser)) {
      return true;
    }

    return false;
  }

  toResponse(entity: GroupEntity): GroupResponse {
    return {
      id: entity.id,
      userIds: entity.userIds?.map((user) => user.id) ?? [],
      groupIds: entity.groupIds?.map((group) => group.id) ?? [],
    };
  }
}
