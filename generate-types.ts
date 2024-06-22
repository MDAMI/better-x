import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { join } from "path";

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
    typePaths: ['./src/**/*.graphql'],
    path: join(process.cwd(), 'src/graphql.schema.ts'),
    defaultScalarType: 'unknown',
    customScalarTypeMapping: {
        DateTime: 'Date',
    },
    outputAs: 'class',
    watch: true,
})