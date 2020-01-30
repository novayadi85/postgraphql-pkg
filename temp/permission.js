const { rule, shield, and, not } = require('graphql-shield')
const { applyMiddleware } = require('graphql-middleware')
const { makeProcessSchemaPlugin } = require('postgraphile')

const isAuthenticated = rule()(async (parent, args, ctx) => {
  return ctx.isAuthenticated
})


const permissions = shield({
  Query: {
    ::resolverType:: : (isAuthenticated)
  },
  Mutation: {
    createMutation: isAuthenticated,
  },
})

module.exports = makeProcessSchemaPlugin(schema => {
  const newSchema = applyMiddleware(schema, permissions)
  return newSchema
})
