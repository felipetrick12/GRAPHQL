const { ApolloServer } = require("apollo-server");
const typeDefs = require("./DB/Schemas");
const resolvers = require("./DB/Resolvers");

const connectDB = require("./config/mongoose");

//IMPORTANT:  FOR CREATE SERVER IN APOLO, At LEAST THERE IS THAT HAVE,
// ONE SCHEMA AND ONE QUERY
connectDB();
//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log("URL", url);
});
