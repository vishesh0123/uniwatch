CREATE TABLE networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    chain_id VARCHAR(50) NOT NULL UNIQUE,
    rpc_url VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    explorer_url VARCHAR(255) NOT NULL
);

CREATE TABLE transactions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    block_number BIGINT UNSIGNED NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    gas_used BIGINT UNSIGNED,
    gas_price BIGINT UNSIGNED,
    network_id INT,
    FOREIGN KEY (network_id) REFERENCES networks(id)
);

CREATE TABLE mints (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    pool_id VARCHAR(255) NOT NULL,
    amount DECIMAL(38, 0) NOT NULL,
    amount0 DECIMAL(38, 18) NOT NULL,
    amount1 DECIMAL(38, 18) NOT NULL,
    amount_usd DECIMAL(38, 18),
    tick_lower INT,
    tick_upper INT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE burns (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    pool_id VARCHAR(255) NOT NULL,
    amount DECIMAL(38, 0) NOT NULL,
    amount0 DECIMAL(38, 18) NOT NULL,
    amount1 DECIMAL(38, 18) NOT NULL,
    amount_usd DECIMAL(38, 18),
    tick_lower INT,
    tick_upper INT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE swaps (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    pool_id VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount0 DECIMAL(38, 18) NOT NULL,
    amount1 DECIMAL(38, 18) NOT NULL,
    amount_usd DECIMAL(38, 18),
    sqrt_price_x96 BIGINT UNSIGNED,
    tick INT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE collects (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    pool_id VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    amount0 DECIMAL(38, 18) NOT NULL,
    amount1 DECIMAL(38, 18) NOT NULL,
    amount_usd DECIMAL(38, 18),
    tick_lower INT,
    tick_upper INT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE flashed (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    pool_id VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount0 DECIMAL(38, 18) NOT NULL,
    amount1 DECIMAL(38, 18) NOT NULL,
    amount_usd DECIMAL(38, 18),
    amount0_paid DECIMAL(38, 18),
    amount1_paid DECIMAL(38, 18),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

INSERT INTO networks (name, chain_id, rpc_url, symbol, explorer_url) VALUES
('Ethereum', '1', '', 'ETH', 'https://etherscan.io');

INSERT INTO networks (name, chain_id, rpc_url, symbol, explorer_url) VALUES
('Polygon', '137', '', 'MATIC', 'https://polygonscan.io');