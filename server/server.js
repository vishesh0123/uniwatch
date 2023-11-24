import express from "express";
import { connectDatabase } from './db.js'
const app = express()

connectDatabase();

app.listen(5174);