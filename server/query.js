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
      gasUsed
      gasPrice
      mints {
        id
        transaction
        timestamp
        pool
        amount
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
      burns {
        id
        transaction
        timestamp
        pool
        amount
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
      swaps {
        id
        transaction
        timestamp
        pool
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
        transaction
        timestamp
        pool
        owner
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
      }
    }
  }
`
export const getLatestBlock = async () => {
  let data = await axios.post(process.env.ethereum, { query: queryLatestBlock });
  return parseInt(data.data.data.transactions[0].blockNumber);
}

export const getTransactions = async (minBlock, maxBlock, skip) => {
  const query = `{
    transactions(
      where: {
        blockNumber_gte: ${minBlock},
        blockNumber_lte: ${maxBlock},
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
  let data = await axios.post(process.env.ethereum, { query: query });
  return data.data.data.transactions;

}