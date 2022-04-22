const app = require("./app");
const { viewRoutes } = require("./utils/servicesRouter");
require("dotenv").config();


app.listen(process.env.PORT || 3333, () => {
    viewRoutes(app, process.env.PORT || 3333);
});