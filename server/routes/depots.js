import express from "express";
import { pool } from "../db.js";

export const routerDepots = express.Router();

//========================= GET ==============================
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


//========================= POST =============================

// Enregistre un dépôt (personne_id, date_depot, type) :
routerDepots.post("/depots", async (req, res) => {
	const { personne_id, date_depot, type } = req.body;

	// Gestion des champs obligatoires :
	if (personne_id === undefined || date_depot === undefined || type === undefined) {
		return res.status(400).json({erreur : 'Champ obligatoire manquant'});
	}

	// On vérifie que personne_id existe :
	const { rows: rowsPersonneId } = await pool.query(`
		SELECT id
		FROM personne
		WHERE id = $1`, [personne_id]);
		if (rowsPersonneId.length === 0) {
			return res.status(400).json({erreur: `${personne_id} : cet id n'existe pas`});
		} 
	
	// Liste blanche des ENUM type dépôt :
	const TYPE = ['boutique', 'domicile'];
	if (!TYPE.includes(type)) {
		return res.status(400).json({ erreur: `type doit valoir : ${TYPE.join(', ')}`
	});
	}

	// Requête d'insertion dans la base :
	const { rows } = await pool.query(`
		INSERT INTO depot (date_depot, type, personne_id)
		VALUES ($1, $2::type_depot, $3::integer)
		RETURNING *
		`, 
		[date_depot, type, personne_id]
	);

	return res.status(201).json(rows[0]);

});


// Ajoute un objet au depot :
routerDepots.post("/depots/:id/objets", async (req, res) => {
	const { id } = req.params;
	const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;
	
	// Gestion des champs obligatoires :
	if (libelle === undefined || poids_kg === undefined || etat_arrivee === undefined || categorie_id === undefined) {
		return res.status(400).json({erreur : 'Champ obligatoire manquant'});
	}

	// On vérifie que depot_id existe :
	const { rows: rowsDepotId } = await pool.query(`
		SELECT id
		FROM depot
		WHERE id = $1`, [id]);
		if (rowsDepotId.length === 0) {
			return res.status(400).json({erreur: `${id} : cet id de depot n'existe pas`});
		}
	
	// Liste blanche des ENUM etat_arrivee :
	const ETAT = ['bon_etat', 'a_reparer', 'hors_service'];
	if (!ETAT.includes(etat_arrivee)) {
		return res.status(400).json({ erreur: `etat doit valoir : ${ETAT.join(', ')}`
	});
	}

	// Vérif. que poids_kg est un nombre :
	if (typeof poids_kg !== "number") {
		return res.status(400).json({erreur: `poids_kg doit être un nombre`});
	}

	// Requête d'insertion dans la base :
	const { rows } = await pool.query(`
		INSERT INTO objet (libelle, poids_kg, etat_arrivee, categorie_id, depot_id)
		VALUES ($1, $2, $3::etat_objet, $4::integer, $5::integer)
		RETURNING *`,
		[libelle, poids_kg, etat_arrivee, categorie_id, id]
	);

	return res.status(201).json(rows[0]);
});