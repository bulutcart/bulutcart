const mysql = require("mysql2/promise");

const DataBase = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Varsayılan port 3306
    waitForConnections: true,
    connectionLimit: 10, // Maksimum 10 bağlantı
    queueLimit: 0
});

module.exports = DataBase; // Tüm projede pool'u kullan
