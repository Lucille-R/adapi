//============== IMPORTS ====================
import express from "express";
import "dotenv/config"; // Va servir à importer le numéro du port (3000) au lieu de l'écrire en dur dans app.listen(3000, ...)


//============= MIDDLEWARE ====================

const app = express();
app.use(express.json());

//============= MONTAGE ROUTES ================


//---------------------------------------------



//---------------------------------------------
app.listen(process.env.PORT, () => {
	console.log("Serveur sur http://localhost:3000");
});