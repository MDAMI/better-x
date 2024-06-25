import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetsService } from './tweets.service';
import { TweetsResolver } from './tweets.resolver';
import { Tweet } from './tweet.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), PermissionsModule, GroupsModule],
  providers: [TweetsService, TweetsResolver],
})
export class TweetsModule {}
