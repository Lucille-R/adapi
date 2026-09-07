import express from "express";
import { pool } from "../db.js";

export const routerObjets = express.Router();

//========================= GET ==============================

// La liste des objets, avec le libellé de leur catégorie
routerObjets.get("/objets", async (req, res) => {

	// Filtre optionnel par statut ou categorie :
	const { statut, categorie_id } = req.query;
	const statutFiltre = statut ?? null; // L'opérateur ?? renvoie la valeur de droite uniquement si celle de gauche est null ou undefined - A mettre car si ?genre_id=1 n'est pas dans l'URL, req.query.genre_id vaut undefined alors que PostgreSQL veut null
	const categorieFiltre = categorie_id ?? null;

	// Liste blanche des ENUM statut :
	const STATUT = ['arrive', 'en_reparation', 'en_rayon', 'vendu', 'recycle'];
	if(statut !== undefined && !STATUT.includes(statut)) {
		return res.status(400).json({
			erreur: `statut doit valoir : ${STATUT.join(', ')}`});
	};

	const { rows } = await pool.query(`
		SELECT objet.id, objet.libelle,
			objet.poids_kg, objet.etat_arrivee, objet.statut,
			objet.prix, objet.date_mise_rayon,
			objet.categorie_id,
			categorie.libelle AS categorie
		FROM objet
		JOIN categorie ON objet.categorie_id = categorie.id
		WHERE objet.statut = COALESCE($1::statut_objet, objet.statut)
			AND objet.categorie_id = COALESCE($2::integer, objet.categorie_id)`,
		[statutFiltre, categorieFiltre]);

	res.status(200).json(rows);
	
});

// Un objet, sa catégorie, son dépôt et le nom de sa donatrice
routerObjets.get("/objets/:id", async (req, res) => {
	const { id } = req.params;
	
	const { rows } = await pool.query(`
		SELECT objet.id, objet.libelle, objet.poids_kg,
		objet.etat_arrivee, objet.statut, objet.prix,
		objet.date_mise_rayon,
		categorie.libelle AS categorie,
		depot.type AS type_depot,
		personne.nom AS nom_donatrice,
		personne.prenom AS prenom_donatrice
		FROM objet
		JOIN categorie ON objet.categorie_id = categorie.id
		JOIN depot ON objet.depot_id = depot.id
		JOIN personne ON depot.personne_id = personne.id
		WHERE objet.id = $1::integer
		`, [id]);
	
		if (rows.length === 0) {
			return res.status(404).json({erreur: `${id} : cet id n'existe pas`});
		};

		res.status(200).json(rows[0]);
});

//========================= PATCH =============================
// Fait évoluer le statut d’un objet (statut, prix?) :
routerObjets.patch("/objets/:id/statut", async (req, res) => {
	const { id } = req.params;
	const { statut, prix } = req.body;

	// Gestion des champs obligatoires :
	if (statut === undefined) {
		return res.status(400).json({ erreur: 'Champ obligatoire manquant'});
	}

	// Liste blanche de l'ENUM statut :
	const STATUT = ['arrive','en_reparation', 'en_rayon', 'vendu', 'recycle'];
	if (!STATUT.includes(statut)) {
		return res.status(400).json({ erreur: `statut doit valoir : ${STATUT.join(', ')}`});
	}

	// Requête de modification de la base :
	const { rows } = await pool.query(`
		UPDATE objet
		SET statut = $2::statut_objet,
			prix = COALESCE($3::numeric, prix)
		WHERE id = $1
		RETURNING *`, 
		[id, statut, prix ?? null]);
	
	if (rows.length === 0) {
		return res.status(404).json({ erreur: `${id} : cet identifiant est inexistant`});
	}
	
	return res.status(200).json(rows[0]);
});