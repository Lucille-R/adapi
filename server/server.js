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

app.use("/api", routerCategories);
app.use("/api", routerObjets);
app.use("/api", routerDepots);
app.use("/api", routerPersonnes);
app.use("/api", routerStats);


//---------------------------------------------


//---------------------------------------------
app.listen(process.env.PORT, () => {
	console.log("Serveur sur http://localhost:3000");
});