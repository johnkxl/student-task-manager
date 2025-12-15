import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import PasswordInput from './PasswordInput';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await createUserWithEmailAndPassword(auth, email, pass);
      else await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">{isRegister ? 'Create Account' : 'Welcome Back'}</h3>
        <ul className="nav nav-pills nav-fill mb-3">
          <li className="nav-item">
            <button className={`nav-link ${!isRegister && 'active'}`} onClick={() => setIsRegister(false)}>Login</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${isRegister && 'active'}`} onClick={() => setIsRegister(true)}>Register</button>
          </li>
        </ul>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <PasswordInput
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          <button className="btn btn-primary w-100" type="submit">{isRegister ? 'Register' : 'Login'}</button>
          {error && <p className="text-danger mt-2 small text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}