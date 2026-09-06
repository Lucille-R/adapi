import express from "express";
import { pool } from "../db.js";

export const routerDepots = express.Router();

// Un dépôt, sa donatrice, et la liste des objets qu’il contient
routerDepots.get("/depots/:id", async (req, res) => {
	const { id } = req.params;

	// Infos du dépôt + sa donatrice :
		// renommage de la propriété 'rows' pour la réutiliser dans l'assemblage
	const { rows: rowsDepot } = await pool.query(`
		SELECT depot.id, depot.date_depot, depot.type,
		personne.nom AS nom_donatrice,
		personne.prenom AS prenom_donatrice
		FROM depot
		JOIN personne ON depot.personne_id = personne.id
		WHERE depot.id = $1::integer`, [id]);
	
		if (rowsDepot.length === 0) {
			return res.status(404).json({erreur: `${id}: cet id n'existe pas`});
		};

	// Les objets du dépôt concerné :
	const { rows: rowsObjetsDepot } = await pool.query(`
		SELECT id, libelle, poids_kg, etat_arrivee, statut, prix
		FROM objet
		WHERE depot_id = $1::integer`, [id]);

	// Assemblage du dépôt et de ses objets :
	const reponse = {
		id: rowsDepot[0].id,
		date_depot: rowsDepot[0].date_depot,
		type: rowsDepot[0].type,
		nom_donatrice: rowsDepot[0].nom_donatrice,
		prenom_donatrice: rowsDepot[0].prenom_donatrice,
		objets: rowsObjetsDepot
	};
	
	res.status(200).json(reponse);
});