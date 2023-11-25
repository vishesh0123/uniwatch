import express from "express";
import { createDBConnection, createQueue, syncDb } from './initialize.js';

const app = express()

let dbQueue = createQueue();

syncDb(dbQueue);

app.listen(5174);