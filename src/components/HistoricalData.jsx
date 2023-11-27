import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Typography } from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';

const transactionTypes = ['Swap', 'Mint', 'Burn', 'Collect'];

function HistoricalData() {
  const [dates, setDates] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isTransactionData, setIsTransactionData] = useState(true);


  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5174/data', {
        params: {
          from: dates.start === '' ? false : dates.start,
          to: dates.end === '' ? false : dates.end,
          wallet: walletAddress === '' ? false : walletAddress,
          pool: poolAddress === '' ? false : poolAddress,
          swap: transactionType.includes('Swap'),
          mint: transactionType.includes('Mint'),
          burn: transactionType.includes('Burn'),
          collect: transactionType.includes('Collect')
        }
      });

      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDateChange = (event) => {
    setDates({ ...dates, [event.target.name]: event.target.value });
  };

  const handleTransactionTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setTransactionType(typeof value === 'string' ? value.split(',') : value);
  };

  const exportAsCsv = () => {
    const csvRows = [
      'id,transaction_id,timestamp,pool_id,sender,recipient,amount0,amount1,amount_usd,tick,block_number,gas_used,gas_price,network_name'
    ];

    transactions.forEach(tx => {
      const csvRow = [
        tx.id,
        tx.transaction_id,
        tx.timestamp,
        tx.pool_id,
        tx.sender,
        tx.recipient,
        tx.amount0,
        tx.amount1,
        tx.amount_usd,
        tx.tick,
        tx.block_number,
        tx.gas_used,
        tx.gas_price,
        tx.network_name
      ];
      csvRows.push(csvRow.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'uniswap-v3-transactions.csv');
  };

  const exportAsJson = () => {
    const jsonString = JSON.stringify(transactions);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'uniswap-v3-transactions.json');
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: '30px' }}>

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ ml: "20px", border: '1px solid white', borderRadius: '5px', width: '237px' }}>
          <Button onClick={() => {
            setIsTransactionData(true);
          }} sx={{ borderRight: '1px solid white', backgroundColor: isTransactionData ? 'GrayText' : 'inherit' }}>
            <Typography style={{ 'textTransform': 'none', color: 'white' }}>
              Transactions Data
            </Typography>
          </Button>
          <Button onClick={() => {
            setIsTransactionData(false);
          }} sx={{ backgroundColor: isTransactionData ? 'inherit' : 'GrayText' }}>
            <Typography style={{ 'textTransform': 'none', color: 'white' }}>
              Pool Data
            </Typography>
          </Button>

        </Box>
        <Box sx={{ ml: '20px' }}>
          <FormControl sx={{
            '& .css-1yk1gt9-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root': {
              color: 'white'

            },
            '& label.Mui-focused': {
              color: 'white',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              },
              '& select': {
                color: 'white',
              },
              '& .MuiCheckbox-root': {
                color: 'white',
              },
              '& .MuiSvgIcon-root': { // This will ensure that icons are also white
                color: 'white',
              },
              width: '250px',
              height: '35px'
            },
            '& .MuiInputLabel-root': { // label color
              color: 'white',
            },
            '& .MuiFormHelperText-root': { // helper text color
              color: 'white',
            },
          }}>
            <InputLabel id="demo-simple-select-label">Network</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={10}
              label="Network"
              onChange={() => { }}
            >
              <MenuItem value={10}>Ethereum</MenuItem>
              <MenuItem value={20}>Polygon</MenuItem>
              <MenuItem value={30}>-</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', ml: "20px", mr: '20px', mt: '40px' }}>
        {isTransactionData && <TextField
          label="Start Date"
          type="date"
          name="start"
          value={dates.start}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: '200px', input: { color: 'white' }, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // border color when hovered
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // border color when focused
              }
            },
            '& .MuiInputLabel-root': { color: 'white' }, // label color
            '& .MuiFormHelperText-root': { color: 'white' },
          }}
        />}
        {isTransactionData && <TextField
          label="End Date"
          type="date"
          name="end"
          value={dates.end}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: '200px', input: { color: 'white' }, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // border color when hovered
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // border color when focused
              }
            },
            '& .MuiInputLabel-root': { color: 'white' }, // label color
            '& .MuiFormHelperText-root': { color: 'white' },
          }}
        />}

        {isTransactionData && <FormControl sx={{
          '& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root': {
            color: 'white'

          },
          '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
            '& input': {
              color: 'white',
            },
            '& select': {
              color: 'white',
            },
            '& .MuiCheckbox-root': {
              color: 'white',
            },
            '& .MuiSvgIcon-root': { // This will ensure that icons are also white
              color: 'white',
            },
            width: '250px'
          },
          '& .MuiInputLabel-root': { // label color
            color: 'white',
          },
          '& .MuiFormHelperText-root': { // helper text color
            color: 'white',
          },
        }}>
          <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
          <Select
            labelId="transaction-type-label"
            multiple
            value={transactionType}
            onChange={handleTransactionTypeChange}
            input={<OutlinedInput label="Transaction Type" />}
            renderValue={(selected) => selected.join(', ')}

          >
            {transactionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={transactionType.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>}


        {isTransactionData && <TextField
          label="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          sx={{
            input: { color: 'white' }, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // border color when hovered
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // border color when focused
              }
            },
            '& .MuiInputLabel-root': { color: 'white' }, // label color
            '& .MuiFormHelperText-root': { color: 'white' },
          }}
        />}

        <TextField
          label="Pool Address"
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
          sx={{
            input: { color: 'white' }, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // border color when hovered
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // border color when focused
              }
            },
            '& .MuiInputLabel-root': { color: 'white' }, // label color
            '& .MuiFormHelperText-root': { color: 'white' },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: 'center', mt: '30px' }}>
        <Button onClick={exportAsCsv}>Export as CSV</Button>
        <Button onClick={exportAsJson}>Export as JSON</Button>
        <Button onClick={fetchTransactions}>Fetch Transactions</Button>
      </Box>
    </Box>
  );
}

export default HistoricalData;
