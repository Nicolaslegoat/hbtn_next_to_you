<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

// Fonction pour récupérer tous les magasins
function getAllStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store");

    $list_store = array();
    while ($row = $result->fetch_assoc()) {
        $list_store[] = $row;
    }

    return $list_store;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération de tous les magasins
$list_magasins = getAllStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_magasins);

// Fermeture de la connexion
$connexion->close();
?>
