import mysql from 'mysql2'
import dbConfig from '../db.config.js'
import Queue from "bull";
import fs from 'fs';
import { getLatestBlock, getTransactions } from './query.js'

export const createDBConnection = () => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            return console.error(err)
        }
        console.log("\x1b[32m", 'Connected To MySql Server !');

    });

    return connection;

}

export const createQueue = () => {
    const dbqueue = new Queue('Queue For Data Fetching and Storing');
    dbqueue.process(async (job, done) => {
        let minBlock = job.data.lastSync;
        let maxBlock = job.data.latest;
        if (minBlock == maxBlock) {
            job.progress(100);
            done();
        }
        else {
            let pages = 1000;
            let skip = 0;
            let data;
            let conn = createDBConnection();

            for (let i = 0; i <= 5000; i++) {
                data = await getTransactions(minBlock, maxBlock);
                data.forEach(tx => {
                    const { id, blockNumber, timestamp, gasUsed, gasPrice, mints, burns, swaps, collects } = tx;
                    const sql = `INSERT INTO transactions (id, block_number, timestamp, gas_used, gas_price , network_id) VALUES ("${id}", ${parseInt(blockNumber)}, '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', ${parseInt(gasUsed)}, ${parseInt(gasPrice)},1)`;
                    conn.query(sql, function (err, results, fields) {
                        console.log(err);
                    });
                });
                if (data.length < 1000) {
                    break;
                } else {
                    skip++;
                }

            }
            console.log("done");
            done();
        }
    })
    console.log("\x1b[32m", 'BullMq Queue Initialized!');
    return dbqueue;
}

export const syncDb = async (dbqueue) => {
    const cache = JSON.parse(fs.readFileSync('cache.json'));
    let lastSync = cache["ethereum"];
    let latest = await getLatestBlock();
    dbqueue.add({
        lastSync: lastSync,
        latest: latest
    });

}