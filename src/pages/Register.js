// src/pages/Register.js
import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a Firestore document for the new user in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        displayName: '',
        bio: '',
        // Add any other default fields you want
      });

      navigate('/profile'); // Redirect to profile page on success
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Failed to register. Please try again.');
    }
  };

  return (
   <div className='full-page'> <div class="center">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='btn btn-success'>Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div></div>
  );
};

export default Register;
