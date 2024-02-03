import axios from "axios"
import dotenv from 'dotenv'
dotenv.config();

const queryLatestBlock = `
{
    transactions(
      first: 1,
      orderBy: blockNumber,
      orderDirection: desc
    ) {
      id
      blockNumber
      timestamp
    }
  }
`
export const getLatestBlock = async (network_id) => {
  let subgraphUrl;
  if (network_id === 1) {
    subgraphUrl = process.env.ethereum;
  }
  if (network_id === 137) {
    subgraphUrl = process.env.polygon;
  }
  let data = await axios.post(subgraphUrl, { query: queryLatestBlock });
  return parseInt(data.data.data.transactions[0].blockNumber);
}

export const getTransactions = async (minBlock, maxBlock, skip, network_id) => {
  let subgraphUrl;
  if (network_id === 1) {
    subgraphUrl = process.env.ethereum;
  }
  if (network_id === 137) {
    subgraphUrl = process.env.polygon;
  }
  const query = `{
    transactions(
      where: {
        blockNumber_gte: ${parseInt(minBlock)},
        blockNumber_lte: ${parseInt(maxBlock)},
      },
      first: 1000,
      skip: ${skip},
      orderBy: blockNumber,
      orderDirection: asc
    ) {
      id
      blockNumber
      timestamp
      gasUsed
      gasPrice
      mints {
        id
        transaction {
          id
        }
        timestamp
        pool {
          id
        }
        amount
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
      burns {
        id
        transaction {
          id
        }
        timestamp
        pool {
          id
        }
        amount
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
      swaps {
        id
        transaction {
          id
        }
        timestamp
        pool {
          id
        }
        sender
        recipient
        amount0
        amount1
        amountUSD
        sqrtPriceX96,
        tick
      }
      collects {
        id
        transaction {
          id
        }
        timestamp
        pool {
          id
        }
        owner
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
    }
  }`

  let data = await axios.post(subgraphUrl, { query: query });
  return data.data.data.transactions;

}

export const getPoolData = async (minTimestamp, maxTimestamp, skip, pool, network_id) => {
  let subgraphUrl;
  if (network_id === 1) {
    subgraphUrl = process.env.ethereum;
  }
  if (network_id === 137) {
    subgraphUrl = process.env.polygon;
  }
  const query = `
  {
    PoolHourDatas(
      where : {
        date_gte: ${parseInt(minTimestamp)}
        date_lte: ${parseInt(maxTimestamp)}
        pool: "${pool}"
      },
      orderBy: date,
      orderDirection: asc,
      first: 1000,
      skip: ${skip}
      
    ){
      id
      date
      pool {
        id
      }
      liquidity
      token0Price
      token1Price
      tick
      volumeToken0
      volumeToken1
      volumeUSD
      feesUSD
      txCount
      
      
    }
  }
  `

  let data = await axios.post(subgraphUrl, { query: query });
  return data.data.data.poolDayDatas;
}

export const latestPoolDataTimestamp = async (network_id) => {
  let subgraphUrl;
  if (network_id === 1) {
    subgraphUrl = process.env.ethereum;
  }
  if (network_id === 137) {
    subgraphUrl = process.env.polygon;
  }

  const query = `{
    poolDayDatas(
      orderBy: date,
      orderDirection: desc,
      first: 1
      
    ){
      id
      date
    }
  }`

  let data = await axios.post(subgraphUrl, { query: query });
  return parseInt(data.data.data.poolDayDatas[0].date);
}