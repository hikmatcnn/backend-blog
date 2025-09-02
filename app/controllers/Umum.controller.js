const { Op, Sequelize, where, or } = require('sequelize');
// const { generateToken } = require('../middlewares/Auth.middleware');
const sequelize = new Sequelize(process.env.DATABASE_URL);
// const initModels = require('../database/init');
// const { defineLevel } = require('../helpers/App.helper');
// var models = initModels(sequelize);

module.exports.getUmumProduct = async (req, res, next) => {
    const products = [
    { id: 1, name: "Frontend Small Projects", price: "₹49" },
    { id: 2, name: "Role-based Frontend Projects", price: "₹149" },
    { id: 3, name: "MERN Stack Project", price: "₹449" },
    { id: 4, name: "Role-based Advance MERN Stack", price: "₹999" },
    { id: 5, name: "Fully SaaS Projects", price: "₹2999" }
    ];
    res.status(200).json({
        message: "Jenis File fetched successfully",
        data: products
    });    
}

module.exports.getUmumCekDB = async (req, res, next) => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connection successful with Sequelize');
        res.status(200).json({
            message: "Jenis File fetched successfully",
            data: "✅ PostgreSQL connection successful with Sequelize"
        });
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error.message);
        sendError(req, next, error);        
    } finally {        
        await sequelize.close();
    } 
}
