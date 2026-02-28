import logo from '../assets/logoNoName.png';
import { useState, useEffect } from 'react';
import BgImage from '../assets/bg.jpg';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState({
    email: '',
    password: '',
    general: ''
  });

  //password validation
  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?#&]{8,}$/;

    let currentPasswordError = "";

    // 1. Check complexity only if user has started typing
    if (formData.password.length > 0 && !passwordRegex.test(formData.password)) {
      currentPasswordError = "Password must be 8+ chars, including letters, numbers, and symbols.";
    }
    // 2. Check if passwords match
    else if (formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword) {
      currentPasswordError = "Passwords do not match.";
    }

    // Set the state correctly
    setError(prev => ({ ...prev, password: currentPasswordError }));
  }, [formData.password, formData.confirmPassword]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Prevent submission if there are active real-time errors
    if (error.password) return;

    // Reset other errors
    setError(prev => ({ ...prev, email: '', general: '' }));

    try {
      const response = await axios.post('http://localhost:5005/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert(response.data.message);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";

      if (err.response?.status === 403 || errorMsg.toLowerCase().includes("email")) {
        setError(prev => ({ ...prev, email: errorMsg }));
      } else {
        setError(prev => ({ ...prev, general: errorMsg }));
      }
    }
  };

  return (
    <>
      <div className="signup-bg" style={{ backgroundImage: `url(${BgImage})` }}>
        <div className="signup-container">
          <div className="logo-section">
            <img src={logo} className="logo" alt="logo" />
            <h2 className="brand-name">ENVOtix</h2>
          </div>

          <h3 className="title">Create Your Account</h3>
          <p className="subtitle">Enter your details below to set up your account.</p>

          <form className="signup-form" onSubmit={handleSignup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <label>Email Address</label>
            <input
              type="email"
              className={error.email ? "input-error" : ""}
              placeholder="john.doe@example.com"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {error.email && <p className='error-message'>{error.email}</p>}

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={error.password ? "input-error" : ""}
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                className={error.password ? "input-error" : ""}
                required
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <span className="toggle-icon" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* The error message below will update as the user types */}
            {error.password && <p className='error-message'>{error.password}</p>}
            {error.general && <p className='error-message' style={{ textAlign: 'center' }}>{error.general}</p>}

            <button className="signup-btn" type="submit">Sign Up</button>
            <p className="login-text">Already have an account? <a href="/login">Sign In</a></p>
          </form>

          <p className="terms">
            By signing up, you agree to our <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style>{`
/* Background */
.signup-bg {
  background: url('../assets/bg.jpg') center/cover no-repeat;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}


/* Card Container */
.signup-container {
  background: #ffffff;
  padding: 5px 40px 5px 30px;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  overflow-y: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* Logo Section */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.logo {
  width: 45px;
}

.brand-name {
  color: #1aad4f;
  margin-top: 5px;
  font-size: 22px;
  font-weight: 700;
}

/* Titles */
.title {
  font-size: 20px;
  margin-top: 10px;
  font-weight: 650;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

/* Form */
.signup-form {
  text-align: left;
}

.signup-form label {
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  display: block;
}

.signup-form input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}

.password-wrapper {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 17px;
}

.password-strength {
  font-size: 12px;
  color: green;
  margin-top: 4px;
}

/* Button */
.signup-btn {
  margin-top: 20px;
  width: 100%;
  background: #1aad4f;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.signup-btn:hover {
  background: #0e8f3d;
}

.login-text {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.login-text a {
  color: #1aad4f;
  font-weight: 600;
}

/* Terms */
.terms {
  margin-top: 10px;
  font-size: 12px;
  color: #555;
}
.error-message {
  color: #d93025; /* Red color */
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
  display: block;
}

.input-error {
  border: 1px solid #d93025 !important;
}

.terms a {
  color: #1aad4f;
}`}
      </style>
    </>
  );
}