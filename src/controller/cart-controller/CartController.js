const asyncHandler = require("express-async-handler");
const User = require("../../model/User");
const Cart = require("../../model/Cart");
const Product = require("../../model/Product");
const jwt = require("jsonwebtoken");
const Brand = require("../../model/Brand");

// user cart
// const userCart = asyncHandler(async (req, res) => {
// const { cart } = req.body;
// console.log("cart...", cart);
// try {
//   // console.log("req.user...", req.user);
//   // if (!req.user) {
//   //   return res.status(401).json({ error: "User not authenticated" });
//   // }
//   // const { userName } = req.user;
//   let products = [];
//   const user = await User.findOne({ userName });
//   console.log("user...", user);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   // Check if the user already has a cart
//   const alreadyExistCart = await Cart.findOne({ orderBy: user.userName });
//   if (alreadyExistCart) {
//     await alreadyExistCart.remove();
//   }
//   for (let i = 0; i < cart.length; i++) {
//     // let object = {};
//     // object.product = cart[i].productCode;
//     // object.count = cart[i].count;
//     // object.color = cart[i].color;
//     // try {
//     //   const getPrice = await Product.findOne({
//     //     productCode: cart[i].productCode,
//     //   })
//     //     .select("price")
//     //     .exec();
//     //   object.price = getPrice.price;
//     // } catch (error) {
//     //   // Handle error when product is not found
//     //   console.error(error);
//     //   res.status(404).json({ error: "Product not found" });
//     //   return;
//     // }
//     // products.push(object);
//     const productCode = cart[i].productCode;
//     const product = await Product.findOne({ productCode });
//     if (!product) {
//       return res
//         .status(404)
//         .json({ error: `Product not found: ${productCode}` });
//     }
//     const { count, color } = cart[i];
//     const price = product.price;
//     products.push({ product: productCode, count, color, price });
//   }
//   let cartTotal = 0;
//   for (let i = 0; i < products.length; i++) {
//     cartTotal = cartTotal + products[i].price * products[i].count;
//   }
//   let newCart = new Cart({
//     products,
//     cartTotal,
//     orderby: user?.userName,
//   });
//   console.log("newCart...", newCart);
//   const saveUserCart = await newCart.save();
//   res.status(200).json(saveUserCart);
// } catch (error) {
//   res.status(500).json({ error: error, message: "Internal server error" });
// }
// });

const userAddToCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const authHeader = req.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    let products = [];
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const userName = userData.userName;
    const alreadyExistCart = await Cart.findOne({ orderBy: userName });
    if (alreadyExistCart) {
      await alreadyExistCart.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      const productCode = cart[i].productCode;
      const product = await Product.findOne({ productCode })
        .select("-_id -__v")
        .populate("brand")
        .exec();
      const brand = await Brand.findOne({ brandCode: product.brandCode });
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found: ${productCode}` });
      }
      const { count, color } = cart[i];
      const price = product.price;
      products.push({
        productCode: productCode,
        product: {
          ...product._doc,
          brand: brand,
        },
        count,
        color,
        price,
      });
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = new Cart({
      products: products,
      cartTotal,
      orderBy: userName,
    });

    const saveUserCart = await newCart.save();
    res.status(200).json(saveUserCart);
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

// get user cart by id
const getUserCart = asyncHandler(async (req, res) => {
  const authHeader = req.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const userName = userData.userName;
    const cart = await Cart.findOne({ orderby: userName }).populate({
      path: "product",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

module.exports = { userAddToCart, getUserCart };
