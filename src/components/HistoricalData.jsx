import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';

const transactionTypes = ['Swap', 'Mint', 'Burn', 'Collect'];

function HistoricalData() {
  // State for filters
  const [dates, setDates] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [transactions, setTransactions] = useState([]); // This would be your fetched data


  const fetchTransactions = async () => {
    try {
      const response = await axios.get('127.0.0.1:5173/data', {
        params: {
          from: dates.start,
          to: dates.end,
          wallet: walletAddress,
          pool: poolAddress,
          swap: transactionType.includes('Swap'),
          mint: transactionType.includes('Mint'),
          burn: transactionType.includes('Burn'),
          collect: transactionType.includes('Collect')
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Handle error (e.g., show notification to the user)
    }
  };

  // Handle date filter change
  const handleDateChange = (event) => {
    setDates({ ...dates, [event.target.name]: event.target.value });
  };

  // Handle transaction type filter change
  const handleTransactionTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setTransactionType(typeof value === 'string' ? value.split(',') : value);
  };

  const exportAsCsv = () => {
    // Convert transactions to CSV format
    const csvRows = [
      // This assumes that your transactions have these fields
      'id,block_number,timestamp,gas_used,gas_price,network_name'
    ];

    transactions.forEach(tx => {
      const csvRow = [
        tx.id,
        tx.block_number,
        new Date(tx.transaction_timestamp).toISOString(),
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

  // Export data as JSON
  const exportAsJson = () => {
    const jsonString = JSON.stringify(transactions);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'uniswap-v3-transactions.json');
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: '30px' }}>
      {/* Date Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', ml: "20px", mr: '20px' }}>
        <TextField
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
        />
        <TextField
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
        />

        {/* Transaction Type Filter */}
        <FormControl sx={{
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
        </FormControl>

        {/* Wallet Address Filter */}
        <TextField
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
        />

        {/* Pool Address Filter */}
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
