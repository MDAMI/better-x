
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TweetCategory {
    Sport = "Sport",
    Finance = "Finance",
    Tech = "Tech",
    News = "News"
}

export class CreateGroup {
    userIds: string[];
    groupIds: string[];
}

export class UpdateTweetPermissions {
    inheritViewPermissions: boolean;
    inheritEditPermissions: boolean;
    viewPermissions: string[];
    editPermissions: string[];
}

export class CreateTweet {
    authorId: string;
    content: string;
    hashtags?: Nullable<string[]>;
    parentTweetId?: Nullable<string>;
    category?: Nullable<TweetCategory>;
    location?: Nullable<string>;
}

export class FilterTweet {
    authorId?: Nullable<string>;
    hashtag?: Nullable<string>;
    parentTweetId?: Nullable<string>;
    category?: Nullable<TweetCategory>;
    location?: Nullable<string>;
}

export class Group {
    id: string;
    userIds: string[];
    groupIds: string[];
}

export abstract class IQuery {
    abstract getGroups(): Group[] | Promise<Group[]>;

    abstract paginateTweets(userId: string, limit: number, page: number): PaginatedTweet | Promise<PaginatedTweet>;

    abstract canEditTweet(userId: string, tweetId: string): boolean | Promise<boolean>;
}

export abstract class IMutation {
    abstract createGroup(input: CreateGroup): Group | Promise<Group>;

    abstract createTweet(input: CreateTweet): Tweet | Promise<Tweet>;

    abstract updateTweetPermissions(tweetId: string, input: UpdateTweetPermissions): boolean | Promise<boolean>;
}

export class Tweet {
    id: string;
    createdAt: DateTime;
    authorId: string;
    content: string;
    hashtags?: Nullable<string[]>;
    parentTweetId?: Nullable<string>;
    category?: Nullable<TweetCategory>;
    location?: Nullable<string>;
}

export class PaginatedTweet {
    nodes: Tweet[];
    hasNextPage: boolean;
}

export type DateTime = Date;
type Nullable<T> = T | null;
