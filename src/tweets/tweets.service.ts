import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { TreeRepository } from 'typeorm';
import { CreateTweet, UpdateTweetPermissions } from 'src/graphql.schema';
import { Permission } from 'src/permissions/permission.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: TreeRepository<Tweet>,
    private permissionService: PermissionsService,
    private groupsService: GroupsService,
  ) {}

  async findAll() {
    return this.tweetsRepository.find();
  }

  async create(input: CreateTweet): Promise<Tweet> {
    const tweetInput = new Tweet();
    tweetInput.authorId = input.authorId;
    tweetInput.content = input.content;
    tweetInput.hashtags = input.hashtags;
    tweetInput.category = input.category;
    tweetInput.location = input.location;
    tweetInput.parentTweetId = input.parentTweetId;

    if (tweetInput.parentTweetId) {
      const parent = await this.tweetsRepository.findOne({
        where: {
          id: tweetInput.parentTweetId,
        },
      });
      if (parent) {
        tweetInput.parentTweet = parent;
      } else {
        throw new BadRequestException('Parent Tweet does not exist');
      }
    }

    const defaultPermission = await this.permissionService.getDefault();
    tweetInput.permission = defaultPermission;

    const tweet = this.tweetsRepository.save(tweetInput);
    return tweet;
  }

  async updateTweetPermissions(
    tweetId: string,
    input: UpdateTweetPermissions,
  ): Promise<boolean> {
    try {
      const tweet: Tweet = await this.tweetsRepository.findOne({
        where: {
          id: tweetId,
        },
      });

      const permission = new Permission();
      permission.updatePermissions(input);

      tweet.permission = permission;

      this.tweetsRepository.save(tweet);
    } catch (error: any) {
      return false;
    }
    return true;
  }

  async canEditTweet(userId: string, tweetId: string) {
    const tweet: Tweet = await this.tweetsRepository.findOne({
      where: {
        id: tweetId,
      },
    });
    const ancestors: Tweet =
      await this.tweetsRepository.findAncestorsTree(tweet);

    const allowedUsers = this.findAllowedUsers(ancestors, TweetAction.EDIT);

    if (allowedUsers.length == 0) {
      return true;
    }

    return this.groupsService.containsUserId(userId, allowedUsers);
  }

  // getPaginatedResults(userId: string, limit: number, page: number) {
  //   this.tweetsRepository.manager.query(`
  //         WITH RECURSIVE grouptree (groupId, link) AS (
  //       SELECT u.id, gl."userId_2"
  //         FROM postgres.public.user u
  //         JOIN user_group_ids_user gl ON u.id = gl."userId_1"
  //        WHERE u.id = ANY($1::VARCHAR[])
  //          AND u.type = 'Group'
  //        UNION ALL
  //       SELECT g.groupid, gl2."userId_2"
  //         FROM grouptree g
  //         JOIN user_group_ids_user gl2 ON g.link = gl2."userId_1"
  //     )
  //     SELECT ul."userId_2" AS id
  //       FROM grouptree gt
  //       JOIN user_user_ids_user ul ON ul."userId_1" = gt.link
  //     `);
  // }

  findAllowedUsers(ancestorList: Tweet, action: TweetAction): string[] {
    const users: string[] = [];
    let currentTweet: Tweet = ancestorList;
    let flag = true;
    while (flag) {
      if (
        action == TweetAction.EDIT
          ? currentTweet.permission?.inheritEditPermissions ?? true
          : (currentTweet.permission?.inheritViewPermissions ?? true) &&
            currentTweet.parentTweet != null
      ) {
        currentTweet = currentTweet.parentTweet;
      } else {
        const newUsers =
          action == TweetAction.EDIT
            ? currentTweet.permission.editPermissions
            : currentTweet.permission.viewPermissions;
        users.push.apply(users, newUsers);
        flag = false;
      }
    }
    return users;
  }
}

export enum TweetAction {
  EDIT = 'edit',
  VIEW = 'view',
}
