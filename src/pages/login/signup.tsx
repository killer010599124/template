import { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const SignUpPage = () => {
  const auth = getAuth();
  const db = getFirestore();
  function registerUser(auth: any, email: any, password: any) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log(user);
        console.log(db);
        updateProfile(user, { displayName: `${fristName} ${lastName}` })
          .then(() => {
            console.log("Profile updated");
            // Profile updated!
            // ...
          })
          .catch((error) => {
            console.log("Profile update Error");
          });
        setDoc(doc(db, "users", user.uid), {
          fristName,
          lastName,
          email,
          phone,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handlefristNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFristName(event.target.value);
  };
  const handlelastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                  Sign Up
                </h3>

                <div className="form-outline mb-4 d-flex">
                  <input
                    type=""
                    id="form2Example22"
                    className="form-control form-control-lg mb-3 me-3 "
                    placeholder="First Name"
                    value={fristName}
                    onChange={handlefristNameChange}
                  />
                  <input
                    type=""
                    id="form2Example23"
                    className="form-control form-control-lg mb-3"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handlelastNameChange}
                  />
                </div>
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
                    type="phone"
                    id="form2Example20"
                    className="form-control form-control-lg"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
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
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="form2Example29"
                    className="form-control form-control-lg"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block"
                    type="submit"
                    style={{ color: "white", width: "100%" }}
                    onClick={() => {
                      registerUser(auth, email, password);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
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

export default SignUpPage;
