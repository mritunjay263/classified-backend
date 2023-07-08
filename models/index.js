'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { NODE_ENV } = require("../config");
const basename = path.basename(__filename);
const env = NODE_ENV || "development";
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
let sequelize;

try{
    NODE_ENV != "production" &&
    console.log("Database useing :", config.database, config.host); //, 
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}catch(err){
  console.log('Database error',err)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
