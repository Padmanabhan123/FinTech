function LoginForm() {
  const form = document.createElement('form');
  form.id = 'loginForm';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Enter your email';
  emailInput.required = true;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Enter your password';
  passwordInput.required = true;

  const errorMessage = document.createElement('p');
  errorMessage.id = 'error-message';
  errorMessage.style.color = 'red';
  errorMessage.style.display = 'none';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Login';

  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(errorMessage);
  form.appendChild(submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    errorMessage.textContent = '';

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
      console.log('Login successful:', data);
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  return form;
}

export default LoginForm;
