const addStoreForm = document.getElementById('addStoreForm');

addStoreForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nomMagasin = document.getElementById('nom_magasin').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

  const data = {
    nom: nomMagasin,
    latitude,
    longitude,
  };

  fetch('add_magasin.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Affichez un message de succès ou gérez la réponse de votre script PHP
    console.log('Magasin ajouté avec succès:', data);
  })
  .catch(error => {
    console.error('Erreur lors de l\'ajout du magasin:', error);

    // Affichez une notification d'erreur à l'utilisateur
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = error.message;
  });
});
