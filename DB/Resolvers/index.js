const Usuario = require("../../models/Usuario").default;
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: ".env",
});

const createdToken = (user, key, expiresIn) => {
  const { id, email, nombre, apellido } = user;

  return jwt.sign({ id }, key, { expiresIn });
};

//Resolver
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET_TOKEN);

      return userId;
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      const existsUser = await Usuario.findOne({ email });
      if (existsUser) {
        throw new Error("El usuario ya existe");
      }
      const salt = brcrypt.genSaltSync(10);
      input.password = await brcrypt.hash(password, salt);

      try {
        const user = new Usuario(input);
        user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    authenticatedUser: async (_, { input }) => {
      const { email, password } = input;

      //if user exist
      const existsUser = await Usuario.findOne({ email });
      if (!existsUser) {
        throw new Error("El usuario no existe");
      }

      //checked if passwrod is correct
      const passwordCorrect = await brcrypt.compare(
        password,
        existsUser.password
      );
      if (!passwordCorrect) {
        throw new Error("El password es incorrecto");
      }

      return {
        token: createdToken(existsUser, process.env.SECRET_TOKEN, "24h"),
      };
    },
  },
};

module.exports = resolvers;
