import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

const transactionTypes = ['Swap', 'Mint', 'Burn', 'Collect'];

function HistoricalData() {
  // State for filters
  const [dates, setDates] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [transactions, setTransactions] = useState([]); // This would be your fetched data


  // Fetch transactions (this function would be more complex in a real application)
  const fetchTransactions = () => {
    // TODO: Fetch transactions from an API or service
    // For now, we'll use dummy data
    setTransactions([
      // ...some dummy transaction data
    ]);
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

  // Export filtered data as CSV
  const exportAsCsv = () => {
    // TODO: Implement CSV export using utility
    exportToCsv(transactions, 'uniswap-v3-transactions.csv');
  };

  // Export filtered data as JSON
  const exportAsJson = () => {
    // TODO: Implement JSON export using utility
    exportToJson(transactions, 'uniswap-v3-transactions.json');
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
      </Box>
    </Box>
  );
}

export default HistoricalData;
