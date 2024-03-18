<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

function connectToDatabase() {
    $host = "localhost";
    $username = "root";
    $password = "";
    $db_name = "Store";
    $port = "3306";
    $socket = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';

    $connexion = new mysqli($host, $username, $password, $db_name, $port, $socket);

    // Vérification de la connexion
    if ($connexion->connect_error) {
        die("La connexion à la base de données a échoué : " . $connexion->connect_error);
    }

    return $connexion;
}

// Fonction pour récupérer les magasins de la catégorie "Fromagerie"
function getFromagerieStores($connexion) {
    $result = $connexion->query("SELECT * FROM list_store WHERE category = 'Fromagerie'");

    $fromagerieStores = array();
    while ($row = $result->fetch_assoc()) {
        $fromagerieStores[] = $row;
    }

    return $fromagerieStores;
}

// Connexion à la base de données
$connexion = connectToDatabase();

// Récupération des magasins de la catégorie "Fromagerie"
$list_fromagerie_magasins = getFromagerieStores($connexion);

// Encodage des résultats en JSON
echo json_encode($list_fromagerie_magasins);

// Fermeture de la connexion
$connexion->close();
?>
