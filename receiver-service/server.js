const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Receiver service listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error syncing database:", err);
    });