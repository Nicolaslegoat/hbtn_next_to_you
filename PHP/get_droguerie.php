<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';


// Fonction pour récupérer les magasins de la catégorie "Droguerie"
function getDroguerieStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Droguerie'");

    $droguerieStores = array();
    while ($row = $result->fetch_assoc()) {
        $droguerieStores[] = $row;
    }

    return $droguerieStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Droguerie"
$list_droguerie_magasins = getDroguerieStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_droguerie_magasins);

// Fermeture de la connexion
$connexion->close();
?>
