import LoginForm from './components/LoginForm.js';
import Dashboard from './components/Dashboard.js';

const app = document.getElementById('app');

const getToken = () => localStorage.getItem('token');
const isAuthenticated = !!getToken();

if (isAuthenticated) {
  const dashboard = new Dashboard();
  app.appendChild(dashboard);
} else {
  const loginForm = new LoginForm();
  app.appendChild(loginForm);
}
