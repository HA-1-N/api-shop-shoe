const routerAuth = require("./user-router/auth");
const routerProduct = require("./product-router/product");
const routerBrand = require("./brand-router/brand");
const routerVoucher = require("./voucher-router/voucher");

function route(app) {
  app.use("/api/auth", routerAuth);
  app.use("/api/product", routerProduct);
  app.use("/api/brand", routerBrand);
  app.use("/api/voucher", routerVoucher);
}

module.exports = route;
