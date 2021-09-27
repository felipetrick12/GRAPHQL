const Usuario = require("../../models/Usuario");
const brcrypt = require("bcryptjs");
//Resolver
const resolvers = {
  Query: {
    getCourse: () => "Algo",
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      const newUser = await Usuario.findOne({ email });
      if (newUser) {
        throw new Error("El usuario ya existe");
      }
      const salt = await brcrypt.getSalt(10);
      input.password = await brcrypt.hash(password, salt);

      try {
        const user = new Usuario(input);
        user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
