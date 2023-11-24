import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

function MenuBar() {
    const pages = ['Positions', 'Pools', 'Historical Data', 'Wallet Tracking', 'Alerts']
    const networks = ['Ethereum', 'Polygon']

    const [nmenu, setnmenu] = useState(false);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'
                sx={{
                    width: '98%',
                    backgroundColor: '#9B1E26',
                    border: '1px solid #9B1E26',
                    borderRadius: '20px',
                    height: '45px',
                    marginTop: 3,
                    marginLeft: 2

                }}>
                <Toolbar>
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: "bold",
                            fontFamily: 'Roboto Condensed',
                            marginBottom: 2
                        }} >
                        Uniswap v3 Position Tracker

                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex', marginLeft: 100 } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                sx={{
                                    color: 'white',
                                    display: 'block',
                                    marginBottom: 2,
                                    marginLeft: 3
                                }}
                            >
                                <Typography sx={{
                                    fontSize: 14,
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                }}>{page}</Typography>
                            </Button>
                        ))}

                    </Box>
                    <Box>
                        <Button sx={{
                            color: 'white',
                            display: 'block',
                            marginBottom: 2,
                            marginLeft: 35
                        }} onClick={() => {
                            setnmenu(true);
                        }}>
                            <Typography sx={{
                                fontSize: 16,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}>Select Network</Typography>
                        </Button>
                        <Menu open={nmenu} keepMounted sx={{
                            left: '1000px'
                        }}>
                            {networks.map((network) => (
                                <MenuItem key={network} >
                                    <Typography textAlign="center">{network}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default MenuBar