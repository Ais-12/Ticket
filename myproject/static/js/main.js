document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/token/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });

  const data = await response.json();

  if (response.ok) {
    // Store tokens in localStorage or sessionStorage
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    // Redirect or update UI as needed
  } else {
    document.getElementById('error-message').innerText = data.detail || 'Login failed';
  }
});
