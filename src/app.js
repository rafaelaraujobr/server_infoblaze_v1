const express = require('express')
const cors = require('cors')
const { resolve } = require("path");
const responseTime = require('response-time');
const fs = require("fs");
class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.setRoutes();
    }
    middlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(express.static(resolve(__dirname, "public")));
        this.app.use(responseTime({ digits: 2 }));
        this.app.use(responseTime((req, res, time) => { console.log(`${req.method} ${req.url} ${time.toString().substring(0, 4)}ms`); }));
    }
    setRoutes() {
        const routeDirectory = resolve(__dirname, 'routes')
        try {
            const files = fs.readdirSync(routeDirectory, { encoding: "utf8" });
            files.forEach(file => {
                this.app.use("/", require(`${routeDirectory}/${file}`));
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new App().app;