import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { DateTimeResolver } from 'graphql-scalars';
import { GroupsModule } from './groups/groups.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GroupsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: DateTimeResolver },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 2345,
      username: 'postgres',
      password: 'big_secret',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
