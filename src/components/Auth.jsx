import { useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';
import PasswordInput from './PasswordInput';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const [unverifiedUser, setUnverifiedUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    setUnverifiedUser(null); // Clear previous state

    try {
      if (isRegister) {
        // Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Send verification email immediately
        await sendEmailVerification(user);

        // Sign user out so they can't access the app yet
        await signOut(auth);

        // Show instruction
        setInfoMsg(`Account created! A verification link has been sent to ${email}. Please verify your email before loggin in.`);
        setIsRegister(false);
      }
      else {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        if (!user.emailVerified) {
          setUnverifiedUser(user);
          await signOut(auth); // Kick them out if not verified
          throw new Error("Email not verified. Please check your inbox.");
        }
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleResendEmail = async () => {
    if (!unverifiedUser) return;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      const user = auth.currentUser;
      await sendEmailVerification(user);
      await signOut(auth);
      
      setInfoMsg(`Verification email resent to ${email}!`);
      setUnverifiedUser(null); // Clear state
      setError('');
    } catch (err) {
      setError("Failed to resend. Please try logging in again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">{isRegister ? 'Create Account' : 'Welcome Back'}</h3>
        
        {/* Messages */}
        {infoMsg && <div className="alert alert-success small">{infoMsg}</div>}
        {/* {error && <div className="alert alert-danger small">{error}</div>} */}

        {/* Resend Button - Only shows if login failed due to verification */}
        {error.includes("not verified") && (
            <div className="text-center mb-3">
                <small className="d-block mb-2 text-muted">Did't get the email?</small>
                <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={handleResendEmail}
                    type="button"
                >
                    Resend Verification Email
                </button>
            </div>
        )}

        {/* Hide default error if we are showing the special resend block above to avoid duplicates */}
        {!error.includes("not verified") && error && (
            <div className="alert alert-danger small">{error}</div>
        )}
        

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
            <input className="form-control" type="email" value={email} 
              onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <PasswordInput
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          
          <button className="btn btn-primary w-100" type="submit">
            {isRegister ? 'Register' : 'Login'}
          </button>
          
          {error && <p className="text-danger mt-2 small text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}