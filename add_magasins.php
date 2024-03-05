<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

// Fonction de connexion à la base de données
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

// Fonction pour ajouter un nouveau magasin
function addStore($connexion, $nom, $latitude, $longitude) {
    // Validation et sécurisation des données (à faire)

    // Préparation de la requête INSERT
    $stmt = $connexion->prepare("INSERT INTO list_store (nom, latitude, longitude) VALUES (?, ?, ?)");

    // Liaison des paramètres
    $stmt->bind_param("sdd", $nom, $latitude, $longitude);

    // Exécution de la requête
    $stmt->execute();

    // Fermeture du statement
    $stmt->close();

    // Envoi d'une réponse JSON de succès
    echo json_encode(['success' => true, 'message' => 'Magasin ajouté avec succès']);
}

// Traitement de la requête
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Récupération des données du formulaire
    $nomMagasin = $_POST['nom_magasin'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];

    // Connexion à la base de données
    $connexion = connectToDatabase();

    // Ajout du nouveau magasin
    addStore($connexion, $nomMagasin, $latitude, $longitude);

    // Fermeture de la connexion
    $connexion->close();
} else {
    // Envoi d'une réponse JSON d'erreur 405
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Requête incorrecte : méthode non autorisée']);
}
?>
