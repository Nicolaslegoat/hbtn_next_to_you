<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

// Fonction pour récupérer les magasins de la catégorie "Fleuriste"
function getFleuristeStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Fleuriste'");

    $fleuristeStores = array();
    while ($row = $result->fetch_assoc()) {
        $fleuristeStores[] = $row;
    }

    return $fleuristeStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Fleuriste"
$list_fleuriste_magasins = getFleuristeStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_fleuriste_magasins);

// Fermeture de la connexion
$connexion->close();
?>
