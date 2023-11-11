import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
const LoginFormStyles = () => (
  <style>{`
    .ftco-section {
      padding: 7em 0;
    }
    .image {
      width: auto;
      height: auto;
    }
    .login-wrap {
      background-color: #d8d8d885;
      border-radius: 10px;
      padding: 4rem;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1), 0px 6px 30px rgba(0, 0, 0, 0.2), 0px 0px 30px rgba(0, 0, 0, 0.3);
    }
    .purple-circle {
      width: 90px;
      height: 90px;
      background-color: #8D448B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: white;
      margin: 0 auto;
    }
    .login-form input[type="text"],
    .login-form input[type="email"],
    .login-form input[type="password"] {
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0.5rem;
      width: 100%;
      margin-bottom: 1rem;
    }
    .login-form .form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .login-form .form-group a {
      color: #8D448B;
    }
    .login-form .form-group a:hover {
      text-decoration: underline;
    }
    .login-form .form-group .w-50 {
      width: 50%;
    }
    .login-form .form-group .w-50.text-md-right {
      text-align: right;
    }
    .login-form .form-group .btn-primary {
      background-color: #8D448B;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    .login-form .form-group .btn-primary:hover {
      background-color: #66346D;
    }
    .center-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .center-content a {
      margin-bottom: 10px;
    }
  `}</style>
);

export{LoginFormStyles};