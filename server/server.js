//============== IMPORTS ====================
import express from "express";
import "dotenv/config"; // Va servir à importer le numéro du port (3000) au lieu de l'écrire en dur dans app.listen(3000, ...)
import { routerCategories } from "./routes/categories.js"
import { routerObjets } from "./routes/objets.js";
import { routerDepots } from "./routes/depots.js";
import { routerPersonnes } from "./routes/personnes.js";
import { routerStats } from "./routes/stats.js";

//============= MIDDLEWARE ====================

const app = express();
app.use(express.json());


//============= MONTAGE ROUTES ================

app.use(routerCategories);
app.use(routerObjets);
app.use(routerDepots);
app.use(routerPersonnes);
app.use(routerStats);


//---------------------------------------------


//---------------------------------------------
app.listen(process.env.PORT, () => {
	console.log("Serveur sur http://localhost:3000");
});