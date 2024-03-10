<?php
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
?>