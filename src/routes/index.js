const routerAuth = require("./user-router/auth");
const routerUser = require("./user-router/user");
const routerProduct = require("./product-router/product");
const routerBrand = require("./brand-router/brand");
const routerVoucher = require("./voucher-router/voucher");
const routerCart = require("./cart-router/cart");
const routerOrder = require("./order-router/order");
const routerColor = require("./color-router/color");
const routerSize = require("./size-router/size");
const routerCategory = require("./category-router/category");

function route(app) {
  app.use("/api/auth", routerAuth);
  app.use("/api/user", routerUser);
  app.use("/api/product", routerProduct);
  app.use("/api/brand", routerBrand);
  app.use("/api/voucher", routerVoucher);
  app.use("/api/cart", routerCart);
  app.use("/api/order", routerOrder);
  app.use("/api/size", routerSize);
  app.use("/api/category", routerCategory);
  app.use("/api/color", routerColor);
}

module.exports = route;
