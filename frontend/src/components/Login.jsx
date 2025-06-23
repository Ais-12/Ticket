import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

function Login({ setAuth }) {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Login request (role is NOT sent to backend)
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: form.username,
        password: form.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // Decode JWT to get role and username
      const decoded = jwtDecode(response.data.access);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('username', decoded.username);

      setAuth(true); 

      // Check if selected role matches actual role
      if (form.role && form.role !== decoded.role) {
        setError(`Role mismatch: You selected "${form.role}" but your account role is "${decoded.role}"`);
        // Optionally, clear tokens and return
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setAuth(false);
        return;
      }

      // Redirect based on role
      if (decoded.role === 'admin') {
        navigate('/admin');
      } else if (decoded.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err); 
      setError(err.response?.data?.detail || 'Login failed');
}

  };

  return (
    <Container style={{ maxWidth: 400, marginTop: 50 }}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" value={form.username} onChange={handleChange} required autoComplete="username" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </Form.Select>
        </Form.Group> */}
        <Button type="submit" variant="success" className="w-100">Login</Button>
        <Link to="/Register" variant="success">Don't you have an Account?</Link>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}

export default Login;
