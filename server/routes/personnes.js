import express from "express";
import { pool } from "../db.js";

export const routerPersonnes = express.Router();

// Création d'une donatrice :
routerPersonnes.post("/personnes", async (req, res) => {
	const { nom, prenom, telephone, adherente } = req.body;

	// Gestion des champs obligatoires Nom et Prénom :
	if (nom === undefined || prenom === undefined) {
		return res.status(400).json({ erreur: 'Champ obligatoire manquant'});
	}

	// Gestion des champs optionnels ('undefined' si valeur absente => 'null' pour telephone, 'false' par défaut pour adherente) :
	const telephoneValeur = telephone ?? null;
	const adherenteValeur = adherente ?? false;

	// Requête d'insertion dans la base :
	const { rows } = await pool.query(`
		INSERT INTO personne (nom, prenom, telephone, adherente)
		VALUES ($1, $2, $3, $4::boolean)
		RETURNING *`,
		[nom, prenom, telephoneValeur, adherenteValeur]
	);

	return res.status(201).json(rows[0]);

});