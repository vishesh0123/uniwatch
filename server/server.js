import express from "express";
import { createQueue, syncDb, createPoolQueue, syncDbPool } from './initialize.js';
import mysql from 'mysql2'
import dbConfig from '../db.config.js'
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

let dbQueue = createQueue();
let poolDbQueue = createPoolQueue();
const cache = JSON.parse(fs.readFileSync('cache.json'));
if (cache["ethereum"] !== null) {
    syncDb(dbQueue, 1);
    syncDbPool(poolDbQueue, 1);
}
if (cache["polygon"] !== null) {
    syncDb(dbQueue, 137);
    syncDbPool(poolDbQueue, 137);
}

app.get('/data', (req, res) => {
    const { from, to, wallet, pool, swap, mint, burn } = req.query;
    const connection = mysql.createConnection(dbConfig);

    let queryParams = [];
    let queryParts = [];

    const addQueryPart = (transactionType, tableName) => {
        let sql = `
        SELECT 
        ${tableName}.*,
        transactions.block_number,
        transactions.timestamp AS transaction_timestamp,
        transactions.gas_used,
        transactions.gas_price,
        networks.name AS network_name
        FROM 
        ${tableName}
        JOIN 
        transactions ON ${tableName}.transaction_id = transactions.id
        JOIN 
        networks ON transactions.network_id = networks.id
        WHERE 1 = 1
      `;

        if (from !== 'false') {
            sql += ' AND transactions.timestamp >= ?';
            queryParams.push(new Date(from).toISOString().slice(0, 19).replace('T', ' '));
        }
        if (to !== 'false') {
            sql += ' AND transactions.timestamp <= ?';
            queryParams.push(new Date(to).toISOString().slice(0, 19).replace('T', ' '));
        }
        if (wallet !== 'false') {
            sql += ' AND transactions.wallet = ?';
            queryParams.push(wallet);
        }
        if (pool !== 'false') {
            sql += ' AND pool_id = ?';
            queryParams.push(pool);
        }

        queryParts.push(sql);
    };

    if (swap === 'true') addQueryPart('swap', 'swaps');
    if (mint === 'true') addQueryPart('mint', 'mints');
    if (burn === 'true') addQueryPart('burn', 'burns');

    let combinedSql = queryParts.join(' UNION ALL ');
    console.log(combinedSql);

    connection.query(combinedSql, queryParams, (error, results) => {
        connection.end();

        if (error) {
            console.error('Error during the database query:', error);
            res.status(500).send('Error while fetching data');
            return;
        }

        res.json(results);
    });
});

app.get('/pooldata', (req, res) => {
    const { pool, network } = req.query;
    const connection = mysql.createConnection(dbConfig);
    let queryParams = [];
    let query = `
    select * from pooldata
    WHERE 1 = 1
    
    `
    if (pool !== 'false') {
        query += ' AND pool_id = ?';
        queryParams.push(pool);
    }
    connection.query(query, queryParams, (error, results) => {
        connection.end();

        if (error) {
            console.error('Error during the database query:', error);
            res.status(500).send('Error while fetching data');
            return;
        }

        res.json(results);

    })
})

app.listen(5174);