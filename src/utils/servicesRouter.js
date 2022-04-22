const Table = require("cli-table");
const colors = require("colors");
const interfaces = require("os").networkInterfaces();

class ServicesRouter {
    static getIpAddress() {
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (
                    alias.family === "IPv4" &&
                    alias.address !== "127.0.0.1" &&
                    !alias.internal
                )
                    return alias.address;
            }
        }
        return "0.0.0.0";
    }
    static viewRoutes(express, port) {
        let table = new Table({
            head: [
                colors.white.bold("Methods"),
                colors.white.bold("Paths"),
                colors.white.bold("ON"),
            ],
            style: { "padding-left": 2, "padding-right": 2 },
        });
        let routes = [];
        express._router.stack.forEach((middleware) => {
            if (middleware.route) routes.push(middleware.route);
            else if (middleware.name === "router")
                middleware.handle.stack.forEach((handler) =>
                    routes.push(handler.route)
                );
        });
        routes.forEach((router) => {
            table.push([
                Object.keys(router.methods),
                `http://${ServicesRouter.getIpAddress()}:${port}${router.path}`,
                colors.green(Object.values(router.methods).toString()),
            ]);
        });
        console.log("");
        console.log("App running at:");
        console.log(`- listening port: ${port}`);
        console.log("- Local: " + `http://localhost:${port}`.green.underline, "(Ctrl + Click)");
        console.log(
            "- Network: " +
            `http://${ServicesRouter.getIpAddress()}:${port}`.green.underline,
            "(Ctrl + Click)"
        );
        console.log("- Press Ctrl + C again to force");
        console.log("- By: " + "Rafael Araujo".blue);
        console.log(table.toString());
    }
}

module.exports = ServicesRouter;