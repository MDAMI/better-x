import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { UpdateTweetPermissions } from 'src/graphql.schema';

@Injectable()
export class PermissionsService {
  DEFAULT_PERMISSIONS: UpdateTweetPermissions = {
    inheritViewPermissions: true,
    inheritEditPermissions: true,
    viewPermissions: [],
    editPermissions: [],
  };

  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  create(tweetId: string) {
    this.permissionsRepository.save({ tweetId, ...this.DEFAULT_PERMISSIONS });
  }
}
