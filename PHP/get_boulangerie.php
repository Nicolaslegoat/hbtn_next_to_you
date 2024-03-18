<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

// Fonction pour récupérer les magasins de la catégorie "Boulangerie"
function getBoulangerieStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Boulangerie'");

    $boulangerieStores = array();
    while ($row = $result->fetch_assoc()) {
        $boulangerieStores[] = $row;
    }

    return $boulangerieStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Boulangerie"
$list_boulangerie_magasins = getBoulangerieStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_boulangerie_magasins);

// Fermeture de la connexion
$connexion->close();
?>
