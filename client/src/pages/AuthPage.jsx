import React, { useState } from "react";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSwitch = () => {
    setIsSignUp((prev) => !prev);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    if (!formData.username || !formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"))
    }

    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if(!res.ok){
        const errorData = await res.json()
        return dispatch(signInFailure(errorData.message || "An error Occured"))
      }

      if (res.ok) {
        setIsSignUp(false);
      }
      const data = await res.json();

      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }
      dispatch(signInSuccess(data))
      console.log(data)
    } catch (err) {
      dispatch(signInFailure(err.message))
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      formData.email === "" ||
      formData.password === ""
    ) {
      dispatch(signInFailure("Please fill all the fields!"));
    }

    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.okay) {
        const errorData = await res.json()
        dispatch(signInFailure(errorData.message || "An error occured"))
      }

      

      const data = await res.json();

      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }

      dispatch(signInSuccess(data))

      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      return dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
      <div className="relative flex justify-between gap-6 w-9/12 h-4/6 max-h-screen mb-20 bg-mintCream border-none shadow-2xl overflow-hidden">
        {/* Overlay Section */}
        <div
          className={`absolute inset-y-0 left-0 flex flex-col justify-center items-center bg-customRed w-1/2 transition-transform duration-700 ease-in-out ${
            isSignUp
              ? "translate-x-0 rounded-r-full"
              : "translate-x-full rounded-l-full"
          }`}
        >
          <h1 className="text-4xl font-bold text-center text-white">
            {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
          </h1>
          <p className="text-center text-white m-3">
            {isSignUp
              ? "Enter your personal details to use all of site features"
              : "Register with your personal details to use all of site features"}
          </p>
          <Button
            className="bg-white hover:bg-customRed" outline
            color="light"
            onClick={handleSwitch}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </div>

        {/* Forms Container */}
        <div
          className={`absolute inset-y-0 right-0 transition-transform duration-700 ease-in-out ${
            isSignUp ? "translate-x-0" : "-translate-x-full"
          } flex w-1/2`}
        >
          {!isSignUp && (
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-4xl font-bold">Sign In</h1>
              <form
                className="my-8 flex flex-col gap-3 w-80"
                onSubmit={handleSignInSubmit}
              >
                <div>
                  <TextInput
                    type="email"
                    placeholder="Email"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <TextInput
                    type="password"
                    placeholder="Password"
                    id="password"
                    onChange={handleChange}
                  />
                </div>
                <Button className="bg-customRed" type="submit" color="failure" disabled={loading}>
                  {loading ? <div>
                    <Spinner size="sm"/>
                    <span className="pl-3">Loading</span>
                  </div>
                  :
                  "Sign In"}
                </Button>
                <OAuth />
              </form>
              {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
            </div>
          )}
          {isSignUp && (
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                <form
                  className="my-6 flex flex-col gap-3 w-80"
                  onSubmit={handleSignUpSubmit}
                >
                  <div>
                    <TextInput
                      type="text"
                      placeholder="Username"
                      id="username"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <TextInput
                      type="email"
                      placeholder="Email"
                      id="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <TextInput
                      type="password"
                      placeholder="Password"
                      id="password"
                      onChange={handleChange}
                    />
                  </div>
                  <Button className="bg-customRed" type="submit" color="failure" disabled={loading}>
                  {loading ? <div>
                    <Spinner size="sm"/>
                    <span className="pl-3">Loading</span>
                  </div>
                  :
                  "Sign Up"}
                </Button>
                <OAuth />
                </form>
                {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
