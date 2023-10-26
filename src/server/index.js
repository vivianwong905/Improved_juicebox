const app = require('./app');
const ViteExpress = require("vite-express");

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);