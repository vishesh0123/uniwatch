import React, { useState } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';

function MenuBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const pages = ['Positions', 'Pools', 'Historical Data', 'Wallet Tracking', 'Alerts'];

    const titleStyles = {
        flexGrow: 1,
        fontWeight: 600, // Bold
        color: 'rgba(255, 255, 255, 0.9)', // White with slight opacity
        textDecoration: 'none',
        fontSize: isMobile ? '1rem' : '1.5rem', // Responsive font size
        textAlign: 'left',
        fontFamily: '"Roboto Condensed", sans-serif',
        textShadow: '0px 0px 1px rgba(255, 255, 255, 0.7)', // Soft white glow
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                background: 'linear-gradient(94.07deg, #9B1E26 -17.35%, #000000 83.2%)',
                borderRadius: 1,
                m: 2,
                boxSizing: 'border-box', // Include padding and borders in the element's width
                width: 'calc(100% - 16px)', // Adjust for margin, assuming 8px margin on each side
                overflow: 'hidden', // Prevents child elements from causing overflow
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={titleStyles}>
                        Uniswap v3 Position Tracker
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button key={page} sx={{ color: 'white', mx: 1 }}>
                                {page}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;
