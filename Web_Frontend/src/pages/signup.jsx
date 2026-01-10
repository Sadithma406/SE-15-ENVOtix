import logo from '../assets/logoNoName.png';
import { useState } from 'react';
import BgImage from '../assets/bg.jpg';
import {Eye, EyeOff} from 'lucide-react';

export default function Signup(){
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return(
        <>
       <div className="signup-bg" style={{ backgroundImage: `url(${BgImage})` }}> 

      <div className="signup-container">
        {/* Logo */}
        <div className="logo-section">
          <img src={logo} className="logo" />
          <h2 className="brand-name">ENVOtix</h2>
        </div>

        <h3 className="title">Create Your Account</h3>
        <p className="subtitle">
          Enter your details below to set up your new ENVOTIX account.
        </p>

        {/* Form */}
        <form className="signup-form">
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" />

          <label>Email Address</label>
          <input type="email" placeholder="john.doe@example.com" />

          {/* Password Field */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
           
            />

            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              
            />
            <span
              className="toggle-icon"
              onClick={() => setShowConfirm(!showConfirm)} 
            >
            {showConfirm? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button className="signup-btn">Sign Up</button>

          <p className="login-text">
            Already have an account? Sign In
          </p>
        </form>

        <p className="terms">
          By signing up, you agree to our{" "}
          <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
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

.terms a {
  color: #1aad4f;
}`}
</style>
   </>   
   )};