import mysql from 'mysql2'
import dbConfig from '../db.config.js'
import Queue from "bull";
import fs from 'fs';
import { getLatestBlock, getTransactions, latestPoolDataTimestamp, getPoolData } from './query.js'

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
    dbqueue.on('completed', () => {
        dbqueue.isReady().then(() => {
            const cache = JSON.parse(fs.readFileSync('cache.json'));
            if (cache["ethereum"] !== null) {
                syncDb(dbqueue, 1);
            }
            if (cache["polygon"] !== null) {
                syncDb(dbqueue, 137);
            }
        })

    })
    dbqueue.process(async (job, done) => {
        let minBlock = job.data.lastsync;
        let maxBlock = job.data.latest;
        let network = job.data.network;
        if (minBlock == maxBlock || minBlock > maxBlock) {
            job.progress(100);
            done();
        } else {
            let pages = 1000;
            let skip = 0;
            let data;
            let conn = createDBConnection();
            console.log("\x1b[32m", `Database is Updated Upto Block ${minBlock - 1}`);

            for (let i = 0; i <= 5000; i++) {
                data = await getTransactions(minBlock, maxBlock, skip, network);
                data.forEach(tx => {
                    const { id, blockNumber, timestamp, gasUsed, gasPrice, mints, burns, swaps, collects } = tx;
                    const sql = `INSERT INTO transactions (id, block_number, timestamp, gas_used, gas_price , network_id) VALUES ("${id}", ${parseInt(blockNumber)}, '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', ${parseInt(gasUsed)}, ${parseInt(gasPrice)},${network})`;
                    conn.query(sql, function (err, results, fields) {
                        if (err !== null) {
                            console.log(err);
                        }
                    });
                    if (mints.length > 0) {
                        const { id, transaction, timestamp, pool, amount, amount0, amount1, amountUSD, tickLower, tickUpper } = mints[0];
                        let query = `INSERT INTO mints (id, transaction_id , timestamp, pool_id, amount, amount0, amount1, amount_usd, tick_lower, tick_upper) VALUES ("${id}","${transaction.id}", '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', "${pool.id}", ${parseFloat(amount)}, ${parseFloat(amount0)}, ${parseFloat(amount1)},${parseFloat(amountUSD)},${parseInt(tickLower)},${parseInt(tickUpper)})`;
                        conn.query(query, function (err, results, fields) {
                            if (err !== null) {
                                console.log(err);
                            }
                        });

                    }
                    if (burns.length > 0) {
                        const { id, transaction, timestamp, pool, amount, amount0, amount1, amountUSD, tickLower, tickUpper } = burns[0];
                        let query = `INSERT INTO burns (id, transaction_id , timestamp, pool_id, amount, amount0, amount1, amount_usd, tick_lower, tick_upper) VALUES ("${id}","${transaction.id}", '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', "${pool.id}", ${parseFloat(amount)}, ${parseFloat(amount0)}, ${parseFloat(amount1)},${parseFloat(amountUSD)},${parseInt(tickLower)},${parseInt(tickUpper)})`;
                        conn.query(query, function (err, results, fields) {
                            if (err !== null) {
                                console.log(err);
                            }

                        });

                    }
                    if (swaps.length > 0) {
                        const { id, transaction, timestamp, pool, sender, recipient, amount0, amount1, amountUSD, sqrtPriceX96, tick } = swaps[0];
                        let query = `INSERT INTO swaps (id, transaction_id , timestamp, pool_id, sender, recipient, amount0, amount1, amount_usd, sqrt_price_x96, tick) VALUES ("${id}","${transaction.id}", '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', "${pool.id}","${sender}" , "${recipient}" ,${parseFloat(amount0)}, ${parseFloat(amount1)},${parseFloat(amountUSD)}, 0 ,${parseInt(tick)})`;
                        conn.query(query, function (err, results, fields) {
                            if (err !== null) {
                                console.log(err);
                            }
                        });

                    }
                    if (collects.length > 0) {
                        const { id, transaction, timestamp, pool, owner, amount0, amount1, amountUSD, tickLower, tickUpper } = collects[0];
                        let query = `INSERT INTO mints (id, transaction_id , timestamp, pool_id, owner, amount0, amount1, amount_usd, tick_lower, tick_upper) VALUES ("${id}","${transaction.id}", '${new Date(parseInt(timestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ')}', "${pool.id}", "${owner}", ${parseFloat(amount0)}, ${parseFloat(amount1)},${parseFloat(amountUSD)},${parseInt(tickLower)},${parseInt(tickUpper)})`;
                        conn.query(query, function (err, results, fields) {
                            if (err !== null) {
                                console.log(err);
                            }
                        });
                    }
                });
                if (data.length < 1000) {
                    break;
                } else {
                    skip++;
                }

            }
            console.log("\x1b[32m", `Fetched Block ${minBlock} to Block ${maxBlock} Successfully !`);
            const cache = JSON.parse(fs.readFileSync('cache.json'));
            if (network === 1) {
                cache.ethereum = maxBlock;

            }
            if (network === 137) {
                cache.polygon = maxBlock;
            }

            fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2));
            done();
        }
    });
    console.log("\x1b[32m", 'BullMq Queue Initialized!');
    return dbqueue;
}

export const syncDb = async (dbqueue, network_id) => {
    const cache = JSON.parse(fs.readFileSync('cache.json'));
    let lastSync;
    if (network_id === 1) {
        lastSync = cache["ethereum"];
    }
    if (network_id === 137) {
        lastSync = cache["polygon"];
    }

    let latest = await getLatestBlock(network_id);
    let start = lastSync + 1;
    let div = Math.floor((latest - start + 1) / 5000);


    for (let i = 0; i < div; i++) {
        dbqueue.add({
            lastsync: start,
            latest: start + 4999,
            network: network_id
        })
        start = start + 5000;

    }
    dbqueue.add({
        lastsync: start,
        latest: latest,
        network: network_id
    })

}

export const syncDbPool = async (dbqueue, network_id) => {
    const cache = JSON.parse(fs.readFileSync('poolcache.json'));
    let pools;
    if (network_id === 1) {
        pools = cache["ethereum"];
    }
    if (network_id === 137) {
        pools = cache["polygon"];
    }

    let latest = await latestPoolDataTimestamp(network_id);
    pools.pools.forEach((pool, index) => {
        const lastupdated = pools.lastupdated[index];
        if (latest > lastupdated) {
            dbqueue.add({
                pool: pool,
                last: lastupdated + 1,
                latest: latest,
                network: network_id
            })
        }
    })
}

export const createPoolQueue = () => {
    const dbqueue = new Queue('Queue For Pooldata');
    dbqueue.process(async (job, done) => {
        console.log(job.data);
        let last = job.data.last;
        let latest = job.data.latest;
        let network = job.data.network;
        let pool = job.data.pool;
        let pages = 1000;
        let skip = 0;
        let data;
        let conn = createDBConnection();
        console.log("\x1b[32m", `Database is Updated Upto Timestamp ${last - 1}`);

        for (let i = 0; i <= 5000; i++) {
            data = await getPoolData(last, latest, skip, pool, network);
            data.forEach(tx => {
                const { id, date, pool, liquidity, token0Price, token1Price, tick, volumeToken0, volumeToken1, volumeUSD, feesUSD, txCount } = tx;
                const query = `INSERT INTO pooldata (
                    id,
                    date,
                    pool_id,
                    liquidity,
                    token0Price,
                    token1Price,
                    tick,
                    volumeToken0,
                    volumeToken1,
                    volumeUSD,
                    feesUSD,
                    txCount
                  ) VALUES (
                    "${id}",
                    "${new Date(parseInt(date) * 1000).toISOString().slice(0, 19).replace('T', ' ')}",
                    "${pool.id}",
                    0,
                    ${parseFloat(token0Price)},
                    ${parseFloat(token1Price)}, 
                    ${parseInt(tick)},
                    ${parseFloat(volumeToken0)},
                    ${parseFloat(volumeToken1)},
                    ${parseFloat(volumeUSD)},
                    ${parseFloat(feesUSD)},
                    ${parseInt(txCount)}
                  );`

                conn.query(query, function (err, results, fields) {
                    if (err !== null) {
                        console.log(err);
                    }
                });


            });
            if (data.length < 1000) {
                break;
            } else {
                skip++;
            }

        }
        console.log("\x1b[32m", `Fetched Pooldata from Time  ${last} to time ${latest} Successfully !`);
        // const cache = JSON.parse(fs.readFileSync('poolcache.json'));
        // if (network === 1) {
        //     cache.ethereumPool = latest;

        // }
        // if (network === 137) {
        //     cache.polygonPool = latest;
        // }

        // fs.writeFileSync('poolcache.json', JSON.stringify(cache, null, 2));


        done();

    })
    console.log("\x1b[32m", 'BullMq Queue Initialized!');
    return dbqueue;
}