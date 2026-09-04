import express from "express";
import { pool } from "../db.js";

export const routerCategories = express.Router();

routerCategories.get("/categories", async (req, res) => {
	const { rows } = await pool.query(`
		SELECT id, libelle
		FROM categorie`);
	res.status(200).json(rows);
});