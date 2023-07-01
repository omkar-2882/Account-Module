import React from "react";
import logo from "./getflylogo.png";
import "./Login.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import validator from "validator";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  let history = useHistory();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validator.isLength(password, { min: 6 })) {
      // Valid password, perform further actions
      setValidPassword(true);
      // ...
    } else {
      // Invalid password
      setValidPassword(false);
    }
    if (validator.isEmail(email)) {
      // Valid email, perform further actions
      setValidEmail(true);
      // ...
    } else {
      // Invalid email
      setValidEmail(false);
    }
    if (validEmail && validPassword) {
      await login();
    }
  };

  const login = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `http://localhost:4000/login`,
        { email: email, password: password },
        config
      );
      if (data.success === true) {
        console.log("Login successful");
        const fourHours = 4 * 60 * 60 * 1000; // Convert 4 hours to milliseconds
        const expirationDate = new Date(Date.now() + fourHours);
        Cookies.set("token", data.token, { expires: expirationDate });
        // Cookies.set("token", data.token, { expires: 0 });
        history.push("/");
        window.location.reload();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mycontainer">
      <div className="main">
        <div className="section1">
          <div className="logo">
            <img className="imglogo" src={logo} alt="logo" />
          </div>
        </div>
        <div className="section2">
          <div className="r-cont">
            <h1 id="heading">Login</h1>
            <p>
              Welcome to {"<"}product name{">"}. Please Login to your account
            </p>
            <form className="myform" onSubmit={handleSubmit}>
              <div className="myform-group">
                {/* <label for="colid"> College Id </label> */}
                <div>
                  College Id <span className="required-field">*</span>{" "}
                </div>
                <input
                  type="text"
                  name="colid"
                  id="colid"
                  required
                  value={email}
                  // onKeyUp={handleChange}
                  onChange={handleEmailChange}
                />
                {!validEmail && (
                  <p className="erroremail">
                    ! Please enter a valid email address.
                  </p>
                )}
              </div>
              <div className="myform-group">
                {/* <label for="Name"> Password </label> */}
                <div>
                  Password <span className="required-field">*</span>{" "}
                </div>
                <div className="passwordinp">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    // onKeyUp={handleChange}
                    onChange={handlePasswordChange}
                  />
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {!validPassword && (
                  <p className="errorpass">
                    ! Password must be at least 6 characters long and meet other
                    criteria.
                  </p>
                )}
              </div>
              <div className="myform-group">
                <input id="btn" type="submit" value="Login" />
              </div>
            </form>
            <div className="gotologin">
              New User ? <Link to="/register"> Register here</Link>{" "}
            </div>
            <div className="footer">www.getflytechnologies.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
