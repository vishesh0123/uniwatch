import express from "express";
import { createQueue, syncDb } from './initialize.js';
import mysql from 'mysql2'
import dbConfig from '../db.config.js'

const app = express()

let dbQueue = createQueue();

syncDb(dbQueue);

app.get('/data', (req, res) => {
    const { from, to, wallet, pool, swap, mint, burn } = req.query;
    const connection = mysql.createConnection(dbConfig);

    let queryParams = [];
    let queryParts = [];

    if (mint !== undefined) {
        let mintSql = `
        SELECT 
        mints.*,
        transactions.block_number,
        transactions.timestamp AS transaction_timestamp,
        transactions.gas_used,
        transactions.gas_price,
        networks.name AS network_name
        FROM 
        mints
        JOIN 
        transactions ON mints.transaction_id = transactions.id
        JOIN 
        networks ON transactions.network_id = networks.id;
      `;
        queryParts.push(mintSql);

    }

    if (burn !== undefined) {
        let burnSql = `
        SELECT 
        burns.*,
        transactions.block_number,
        transactions.timestamp AS transaction_timestamp,
        transactions.gas_used,
        transactions.gas_price,
        networks.name AS network_name
        FROM 
        burns
        JOIN 
        transactions ON burns.transaction_id = transactions.id
        JOIN 
        networks ON transactions.network_id = networks.id;
      `;
        queryParts.push(burnSql);
    }

    if (swap !== undefined) {
        let swapSql = `
        SELECT 
        swaps.*,
        transactions.block_number,
        transactions.timestamp AS transaction_timestamp,
        transactions.gas_used,
        transactions.gas_price,
        networks.name AS network_name
        FROM 
        swaps
        JOIN 
        transactions ON swaps.transaction_id = transactions.id
        JOIN 
        networks ON transactions.network_id = networks.id;
      `;
        queryParts.push(swapSql);

    }
    if (from) {
        queryParams.push(from);
        queryParams.push(from);
        queryParts = queryParts.map(part => part + ' AND transactions.timestamp >= ?');
    }
    if (to) {
        queryParams.push(to);
        queryParams.push(to);
        queryParts = queryParts.map(part => part + ' AND transactions.timestamp <= ?');
    }
    if (wallet) {
        queryParams.push(wallet);
        queryParams.push(wallet);
        queryParts = queryParts.map(part => part + ' AND transactions.wallet = ?');
    }
    if (pool) {
        queryParams.push(pool);
        queryParams.push(pool);
        queryParts = queryParts.map(part => part + ' AND pool_id = ?');
    }

    let combinedSql = queryParts.join(' UNION ALL ');
    console.log(combinedSql);

    connection.query(combinedSql, queryParams, (error, results) => {
        connection.end();

        if (error) {
            console.error('Error during the database query:', error);
            res.status(500).send('Error while fetching data');
            return;
        }

        // Send the results back to the client
        res.json(results);
    });

})

app.listen(5174);