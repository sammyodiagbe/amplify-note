import "./App.css";
import awsconfig from "./aws-exports";
import AwsAmplify, { Auth, Hub } from "aws-amplify";
import { useEffect, useState } from "react";
import CreateTodo from "./createTodo";
import GetTodos from "./getTodos";

AwsAmplify.configure(awsconfig);

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    // console.log(AwsAmplify.Auth.currentUserCredentials());
    validateAuthStatus();
    return Hub.listen("auth", async (response) => {
      const { payload } = response;
      validateAuthStatus();
    });
  }, []);

  const validateAuthStatus = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser({});
      console.log(currentUser);
      setAuthState(true);
    } catch (err) {
      setAuthState(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { user } = await AwsAmplify.Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Account created ", user);
    } catch (err) {
      console.log("something broke ", e);
    }
  };

  const handleAccountConfirmation = async (event) => {
    event.preventDefault();
    try {
      const response = await AwsAmplify.Auth.confirmSignUp(
        "sammyodiagbe",
        code
      );
      console.log(response);
    } catch (err) {
      console.log("error confirming sign up ", err);
    }
  };

  const handleUserSignIn = async (event) => {
    event.preventDefault();
    try {
      const user = await AwsAmplify.Auth.signIn(username, password);
      // console.log(user);
    } catch (err) {
      console.log("there was an error, ", err);
    }
  };

  const signOut = async () => {
    try {
      const signout = await AwsAmplify.Auth.signOut({ global: true });
      // console.log(signout);
    } catch (err) {
      // console.log("Something broke,  ", err);
    }
  };
  return (
    <div className="App">
      <p>Auth State: {authState ? "authenticated" : "not authenticated"}</p>

      {authState && <button onClick={signOut}>Sign out</button>}
      {!authState ? (
        <div>
          <div className="container">
            <h1> Create awesome account</h1>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <button>Create account</button>
            </form>

            <h1>Confirm Signup</h1>
            <form onSubmit={handleAccountConfirmation}>
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <button>Verify account</button>
            </form>

            <h1>Sign in</h1>
            <form onSubmit={handleUserSignIn}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={"true"}
              />
              <br />
              <button>Sign in</button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1>Totally authenticated fam.</h1>
          <CreateTodo />
          <GetTodos />
        </div>
      )}
    </div>
  );
}

export default App;
