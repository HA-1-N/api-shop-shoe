const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const Cart = require("../../model/Cart");
const Product = require("../../model/Product");
const Voucher = require("../../model/Voucher");
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
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    let products = [];
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;

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
      const { count, color, size } = cart[i];
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
        size,
      });
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    const alreadyExistCart = await Cart.findOne({ orderBy: id });

    if (alreadyExistCart) {
      alreadyExistCart.products = alreadyExistCart.products.concat(products);
      alreadyExistCart.cartTotal += cartTotal;
      await alreadyExistCart.save();
      res.status(200).json(alreadyExistCart);
    } else {
      let newCart = new Cart({
        products: products,
        cartTotal,
        orderBy: id,
      });
      const saveUserCart = await newCart.save();
      res.status(200).json(saveUserCart);
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

// get user cart by user name
const getUserCart = asyncHandler(async (req, res) => {
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;
    const cart = await Cart.findOne({ orderBy: id }).populate({
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

// update cart
const updateCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;

    let existingCart = await Cart.findOne({ orderBy: id });

    if (!existingCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    for (let i = 0; i < cart.length; i++) {
      const { productCode, count } = cart[i];
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

      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.productCode === productCode
      );

      if (existingProductIndex !== -1) {
        if (count <= 0) {
          existingCart.products.splice(existingProductIndex, 1); // Remove the item from the cart
        } else {
          existingCart.products[existingProductIndex].count = count; // Update the quantity of the item in the cart
        }
      } else {
        const { color, size } = cart[i];
        const price = product.price;

        existingCart.products.push({
          productCode: productCode,
          product: {
            ...product._doc,
            brand: brand,
          },
          count,
          color,
          price,
          size,
        });
      }
    }

    let cartTotal = 0;
    for (let i = 0; i < existingCart.products.length; i++) {
      const { price, count } = existingCart.products[i];
      cartTotal += price * count;
    }

    existingCart.cartTotal = cartTotal;

    await existingCart.save();

    res
      .status(200)
      .json({ message: "Update cart successful", data: existingCart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

// delete cart
const emptyCart = asyncHandler(async (req, res) => {
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;
    // const user = await User.findById({ id });
    const cart = await Cart.findOneAndRemove({ orderBy: id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

// add voucher to cart
const addVoucher = asyncHandler(async (req, res) => {
  const { voucherCode } = req.body;
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const validVoucher = await Voucher.findOne({ voucherCode: voucherCode });
    if (validVoucher === null) {
      throw new Error("Invalid Voucher");
    }
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;
    const user = await User.findOne({ _id: id });
    let { cartTotal } = await Cart.findOne({ orderBy: id }).populate({
      path: "product",
      model: "Product",
    });
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validVoucher.discount) / 100
    ).toFixed(2);
    const newCart = await Cart.findOneAndUpdate(
      { orderBy: id },
      { totalAfterDiscount },
      { new: true }
    );
    res.status(200).json({ message: "Update successful !", data: newCart });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

module.exports = {
  userAddToCart,
  getUserCart,
  emptyCart,
  addVoucher,
  updateCart,
};
