import { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(auth: any, email: any, password: any) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Incorrect credential");
      });
  }
  function forgotPassword(auth: any, email: any) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
  };

  return (
    <div className="vh-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 text-black" style={{ zIndex: "10" }}>
            <div className="px-5 ms-xl-4">
              <i
                className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4"
                style={{ color: "#709085" }}
              ></i>
              <span className="h1 fw-bold mb-0">Logo</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
              <form style={{ width: "23rem" }} onSubmit={handleSubmit}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px", color: "white" }}
                >
                  Log in
                </h3>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="form2Example18"
                    className="form-control form-control-lg"
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="form2Example28"
                    className="form-control form-control-lg"
                    placeholder="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block"
                    type="submit"
                    style={{ color: "white", width: "100%" }}
                    onClick={() => {
                      login(auth, email, password);
                    }}
                  >
                    Login
                  </button>
                </div>

                <p className="small mb-5 pb-lg-2">
                  <a
                    className=" nav-link"
                    href="#!"
                    style={{ color: "white", border: "none" }}
                    onClick={() => {
                      forgotPassword(auth, email);
                    }}
                  >
                    Forgot password?
                  </a>
                </p>
                <p style={{ color: "white" }}>
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="link-info nav-link"
                    style={{ border: "none" }}
                  >
                    Register here
                  </a>
                </p>
              </form>
            </div>
          </div>

          <div
            className="col-sm-12 px-0 d-none d-sm-block"
            style={{ position: "absolute" }}
          >
            <img
              src={process.env.PUBLIC_URL + "/login.jpg"}
              alt="Login image"
              className="w-100 vh-100"
              style={{ objectFit: "cover", objectPosition: "left" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
