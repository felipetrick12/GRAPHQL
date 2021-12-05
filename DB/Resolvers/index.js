const Products = require("../../models/Products");
const Usuario = require("../../models/Usuario");
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: ".env",
});

const createdToken = (user, key, expiresIn) => {
  const { id } = user;

  return jwt.sign({ id }, key, { expiresIn });
};

//Resolver
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET_TOKEN);

      return userId;
    },
    getAllProducts: async () => {
      try {
        const products = await Products.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProductID: async (_, { id }) => {
      try {
        const product = await Products.findById(id);

        if (!product) {
          throw new Error("Producto no encontrado");
        }
        return product;
      } catch (error) {
        console.log(error);
      }
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
    createdProduct: async (_, { input }) => {
      try {
        const newProduct = new Products(input);

        const createdProduct = await newProduct.save();

        return {
          message: "Producto creado con exito!",
          product: createdProduct,
        };
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Products.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      try {
        product = await Products.findByIdAndUpdate({ _id: id }, input, {
          new: true,
        });
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, { id }) => {
      let product = await Products.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      try {
        await Products.findByIdAndDelete({ _id: id });
        return "El producto fue eliminado con exito";
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
