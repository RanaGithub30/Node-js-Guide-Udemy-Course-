const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type Post {
            _id: ID!
            title: String!
            content: String
            imageUrl: String
            createor: User!
            createdAt: String!
            updatedAt: String!
        },

        type User {
            _id: ID!
            name: String!
            email: String!
            password: String
            status: String
            posts: [Post!]!
        }

        type AuthData {
            token: String!
            userId: String!
        }

        input UserDataInput {
            email: String,
            name: String,
            password: String
        }

        input PostInputData {
            title: String!
            content: String!
            imageUrl: String!
        }

        type PostData {
            posts: [Post!]!
            totalPosts: Int!
        }

        type RootQuery{
            login(email: String!, password: String!): AuthData!
            allPosts: PostData!
        }

        type RootMutation {
            createUser(userInput: UserDataInput): User!
            createPost(postInput: PostInputData): Post!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
`);