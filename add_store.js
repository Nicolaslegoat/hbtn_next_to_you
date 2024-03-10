document.getElementById('addressForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;

  const fullAddress = `${address}, ${city}, ${country}`;
  const nominatimApiEndpoint = 'https://nominatim.openstreetmap.org/search';

  fetch(`${nominatimApiEndpoint}?format=json&q=${fullAddress}`)
      .then(response => response.json())
      .then(data => {
          console.log('Envoi de la requête POST...');

          if (data && data.length > 0) {
              const coordinates = data[0];
              if (coordinates.hasOwnProperty('lat') && coordinates.hasOwnProperty('lon')) {
                  const lat = parseFloat(coordinates.lat);
                  const lon = parseFloat(coordinates.lon);

                  // Ajout dynamique des champs latitude et longitude au formulaire
                  const form = document.getElementById('addressForm');
                  const latitudeField = document.createElement('input');
                  const longitudeField = document.createElement('input');

                  latitudeField.type = 'hidden';
                  latitudeField.name = 'latitude';
                  latitudeField.value = lat;

                  longitudeField.type = 'hidden';
                  longitudeField.name = 'longitude';
                  longitudeField.value = lon;

                  form.appendChild(latitudeField);
                  form.appendChild(longitudeField);

                  // Soumission du formulaire
                  form.submit();
              }
          }
      })
      .catch(error => {
          console.error('Erreur lors de la conversion de l\'adresse:', error);
      });
});



      async function getSuggestions(query, dropdownId) {
          const apiUrl = 'proxy.php?url=https://api.opencagedata.com/geocode/v1/json';
          const apiKey = 'f048cfd5a8524c3bbd08ac3933eaec6c';

          const params = [
              `key=${apiKey}`,
              `q=${encodeURIComponent(query)}`,
          ];

          const response = await fetch(`${apiUrl}?${params.join('&')}`);
          const jsonData = await response.json();

          const suggestionsDropdown = document.getElementById(dropdownId);
          suggestionsDropdown.innerHTML = '';

          jsonData.results.forEach(result => {
              const { formatted } = result;
              const option = document.createElement('option');
              option.value = formatted;
              suggestionsDropdown.appendChild(option);
          });
      }

      function updateSuggestionsAddress() {
          const query = document.getElementById('address').value.trim();
          getSuggestions(query, 'suggestionsDropdownAddress');
      }

      function updateSuggestionsCity() {
          const query = document.getElementById('city').value.trim();
          getSuggestions(query, 'suggestionsDropdownCity');
      }

      function updateSuggestionsCountry() {
          const query = document.getElementById('country').value.trim();
          getSuggestions(query, 'suggestionsDropdownCountry');
      }

      document.getElementById('address').addEventListener('input', updateSuggestionsAddress);
      document.getElementById('city').addEventListener('input', updateSuggestionsCity);
      document.getElementById('country').addEventListener('input', updateSuggestionsCountry);

      // Fonction pour soumettre le formulaire avec les données converties
      async function submitFormData(latitude, longitude) {
  const formData = new FormData(document.getElementById('addressForm'));
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  try {
    const response = await fetch('add_magasins.php', {
      method: 'POST',
      body: formData,
    });

    const jsonData = await response.json();

    if (jsonData.success) {
      alert(jsonData.message);
    } else {
      alert(jsonData.message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}