<?php
// Définition du type de contenu de la réponse
header('Content-Type: application/json');

include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Récupération du nom du magasin et de l'adresse
    $nomMagasin = $_POST['nom_magasin'];
    $latitude = (double)$_POST['latitude'];
    $longitude = (double)$_POST['longitude'];

    // Connexion à la base de données
    $connexion = connectToDatabase();

    // Ajout du nouveau magasin
    $stmt = $connexion->prepare("INSERT INTO list_store (nom, latitude, longitude) VALUES (?, ?, ?)");
    $stmt->bind_param('sdd', $nomMagasin, $latitude, $longitude);
    $stmt->execute();
    $stmt->close();

    $connexion->close();

    // Redirection vers une page HTML spécifique après le succès
    header("Location: validation.html");
    exit; // Assurez-vous de terminer l'exécution du script après la redirection
} else {
    // Envoi d'une réponse JSON d'erreur 405
    echo json_encode(['success' => false, 'message' => 'Requête incorrecte : méthode non autorisée']);
}
?>
