const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

const User = require("../../model/User");
const Cart = require("../../model/Cart");
const Product = require("../../model/Product");
const Voucher = require("../../model/Voucher");
const Brand = require("../../model/Brand");
const Order = require("../../model/Order");

// create order
const createOder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const authHeader = req?.headers.token;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!COD) throw new Error("Create cash order failed");
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;
    const user = await User.findById(id);
    let userCart = await Cart.findOne({ orderBy: id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user.id,
      orderStatus: "Cash on Delivery",
    });

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});
    const createOrder = await newOrder.save();

    res
      .status(200)
      .json({ message: "successful", data: createOrder, updated: updated });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

// get Orders
const getOrders = asyncHandler(async (req, res) => {
  try {
    const authHeader = req?.headers.token;
    const token = authHeader && authHeader.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_SEC);
    const id = userData.id;

    const userOrders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.status(200).json({ data: userOrders });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

// Update status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.status(200).json(updateOrderStatus);
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
});

module.exports = { createOder, getOrders, updateOrderStatus };
