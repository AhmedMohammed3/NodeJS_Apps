//==============Core Modules========
// const fs = require('fs');
// const path = require('path');
//==============Third Party=========
const Sequelize = require('sequelize');
//==============My Code Files=======
const db = require('../util/database');
//==================================
const Order = db.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;