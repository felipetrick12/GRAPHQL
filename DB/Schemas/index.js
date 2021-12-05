const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type User {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  input UserInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  type Token {
    token: String
  }

  input AuthInput {
    email: String!
    password: String!
  }

  type Query {
    #Users
    getUser(token: String!): User

    #Products
    getAllProducts: [Product]
    getProductID(id: ID!): Product
  }

  input ProductInput {
    name: String!
    exist: Int!
    price: Float!
  }

  type Product {
    id: String
    name: String!
    exist: Int
    price: Float
    created: String
  }

  type Message {
    message: String
    product: Product
  }

  type Mutation {
    #Users
    newUser(input: UserInput): User
    authenticatedUser(input: AuthInput): Token

    #Products
    createdProduct(input: ProductInput): Message
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
