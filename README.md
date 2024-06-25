# Better-X

## Installation

```bash
$ npm install
```

Ensure Docker is installed on your system.

## Running the app

```bash
# First, start the database in a different terminal using
$ docker-compose -f .\docker-compose.yml up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## Approach

The approach I took attempted to leverage the relations available in TypeORM to be able to efficiently manage the data inside of a tree structure.

For Tweets, I was able to use a closure table, which would result in efficient reads and writes of the permissions by using a recursive view to store the effective permission for each tweet with minimal overhead.

For Groups, I was unable to use the structures offered out of the box by TypeORM as those are represented by a graph instead of a tree, which TypeORM does not support (at least for it's convenience features). Instead, I store the groups using an adjacency table, with which we can still utilize postgres' traversal features even without support in Typescript.

Groups and Users were treated as seperate entities but stored within the same table to be able to utilize constraints to ensure that user_ids and group_ids were not duplicated, since the permissions would return both ids in the same array without any differentiation.

## API Changes

The UpdateTweetPermissions API was updated to include the tweetId of the tweet being updated. This was a necessary change so that we could update permissions on a specific object.

## Project Status

The project has currently implmented all endpoints except for getting paginated tweets. I had attempted to use materialized recursive views in order to do the work of determining whether a tweet could be accessed by a particular group of users up front, in order to make user experience as smooth as possible. However, TypeORM does not support the creation of recursive views, which I discovered too late into the time box allocated to this assignment. Given more time, we could set up the recursive view as a migration so that it was still accessible from within the Typescript. We would also create an index on the date_created column to be able to quickly sort and paginate the tweets. The views can be found below for posterities sake.

```postgres
WITH RECURSIVE tweet_list (tweet_id, effective_permission) AS (
      	SELECT t.id, t."permissionId"
      	  FROM tweet t
      	 WHERE t."parentTweetId" IS NULL
      	 UNION ALL
      	SELECT t2.id, CASE WHEN p."inheritViewPermissions" THEN tl.effective_permission ELSE p.id END CASE
      	  FROM tweet_list tl
      	  JOIN tweet t2 ON tl.tweet_id = t2."parentTweetId"
      	  JOIN "permission" p ON p.id = t2."permissionId"
      )
   SELECT *
	 FROM tweet_List t

WITH RECURSIVE group_tree (group_id, link) AS (
        SELECT u.id, gl."userId_2"
          FROM postgres.public.user u
          JOIN user_group_ids_user gl ON u.id = gl."userId_1"
          JOIN user_user_ids_user ul ON u.id = ul."userId_1"
         WHERE u.type = 'Group'
         UNION
        SELECT g.group_id, gl2."userId_2"
          FROM group_tree g
          JOIN user_group_ids_user gl2 ON g.link = gl2."userId_1"
  )
SELECT * FROM group_tree
```
