<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

// Fonction pour récupérer les magasins de la catégorie "Primeur"
function getPrimeurStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Primeur'");

    $primeurStores = array();
    while ($row = $result->fetch_assoc()) {
        $primeurStores[] = $row;
    }

    return $primeurStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Primeur"
$list_primeur_magasins = getPrimeurStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_primeur_magasins);

// Fermeture de la connexion
$connexion->close();
?>
