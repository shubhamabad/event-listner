const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserHistory = sequelize.define("UserHistory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user: { type: DataTypes.STRING, allowNull: false },
    class: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    inserted_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    modified_at: { type: DataTypes.DATE },
});

module.exports = UserHistory;