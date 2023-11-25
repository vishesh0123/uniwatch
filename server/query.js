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
        amount
        amount0
        amount1
      }
      burns {
        id
        amount
        amount0
        amount1
      }
      swaps {
        id
        sender
        recipient
        amount0
        amount1
        amountUSD
      }
      collects {
        id
        owner
        amount0
        amount1
      }
    }
  }
`
export const getLatestBlock = async () => {
  let data = await axios.post(process.env.ethereum, { query: queryLatestBlock });
  return parseInt(data.data.data.transactions[0].blockNumber);
}

export const getTransactions = async (minBlock, maxBlock) => {
  const query = `{
    transactions(
      where: {
        blockNumber_gte: ${minBlock},
        blockNumber_lte: ${maxBlock},
      },
      first: 1000,
      skip: 0,
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
        amount
        amount0
        amount1
      }
      burns {
        id
        amount
        amount0
        amount1
      }
      swaps {
        id
        sender
        recipient
        amount0
        amount1
        amountUSD
      }
      collects {
        id
        owner
        amount0
        amount1
      }
    }
  }`
  let data = await axios.post(process.env.ethereum, { query: query });
  return data.data.data.transactions;

}