import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

function PasswordInput({ value, onChange }) {
    const [passwordType, setPasswordType] = useState('password');

    const togglePasswordVisibility = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    return (
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={passwordType}
            placeholder="Enter your password"
            value={value}
            onChange={onChange}
            required
          />
          <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
            {passwordType === 'password' ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </InputGroup>
      </Form.Group>
    );
}

export default PasswordInput;
