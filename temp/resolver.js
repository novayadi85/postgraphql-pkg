const { makeExtendSchemaPlugin, gql } = require("graphile-utils")
const resolver = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Query {
        ::resolverType:: [::tableAlias::!]
      }
    `,
    resolvers: {
      Query: {
        ::resolverType::: (_query, args, context, resolveInfo) =>
          resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.::resolverType::`,
            (tableAlias, queryBuilder) => {
              queryBuilder.orderBy(sql.fragment`random()`);
            }
          ),
      },
    },
  };
});

module.exports = {
  ::resolverName:::resolver
}