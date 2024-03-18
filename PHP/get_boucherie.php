<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

// Fonction pour récupérer les magasins de la catégorie "Boucherie"
function getBoucherieStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Boucherie'");

    $boucherieStores = array();
    while ($row = $result->fetch_assoc()) {
        $boucherieStores[] = $row;
    }

    return $boucherieStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Boucherie"
$list_boucherie_magasins = getBoucherieStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_boucherie_magasins);

// Fermeture de la connexion
$connexion->close();
?>
