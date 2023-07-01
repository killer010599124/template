import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { redirect } from "react-router-dom";

function ProtectRoute({ component: Component, ...rest }: any) {
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [flag, setFlag] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        console.log(user);
        setAuthenticated(true);
        console.log("hello");
      } else {
        setAuthenticated(false);
        console.log("welcome");
      }
      setFlag(false);
    });
    return unsubscribe;
  }, []);
  console.log(user);
  if (flag) {
    return <div></div>;
  } else return <>{authenticated ? <Outlet /> : <Navigate to="/signin" />}</>;
}
export default ProtectRoute;
