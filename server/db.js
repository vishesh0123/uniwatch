import mysql from 'mysql2'
import dbConfig from '../db.config.js'

export const connectDatabase = () => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            return console.error(err)
        }
        console.log("\x1b[32m", 'Connected To MySql Server !');

    })

}

