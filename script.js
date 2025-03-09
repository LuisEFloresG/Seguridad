document.getElementById('guitar-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Obtener los datos del formulario
    const guitarData = {
      brand: document.getElementById('brand').value,
      model: document.getElementById('model').value,
      year: parseInt(document.getElementById('year').value),
      type: document.getElementById('type').value,
      color: document.getElementById('color').value,
      price: parseFloat(document.getElementById('price').value),
      description: document.getElementById('description').value,
      serial: document.getElementById('serial').value
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/guitars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guitarData)
      });
  
      const data = await response.json();
      if (data.error) {
        document.getElementById('error-message').textContent = data.error;
      } else {
        document.getElementById('error-message').textContent = '';
        alert(data.message);
        loadGuitars();
        document.getElementById('guitar-form').reset();
      }
    } catch (error) {
      document.getElementById('error-message').textContent = "Hubo un error al registrar la guitarra.";
    }
  });
  
  // Función para cargar las guitarras registradas
  async function loadGuitars() {
    const response = await fetch('http://localhost:5000/api/guitars');
    const guitars = await response.json();
    const guitarList = document.getElementById('guitar-list');
    guitarList.innerHTML = '';
    guitars.forEach(guitar => {
      const li = document.createElement('li');
      li.textContent = `${guitar.brand} - ${guitar.model}`;
      guitarList.appendChild(li);
    });
  }
  
  // Cargar guitarras al iniciar
  loadGuitars();
  