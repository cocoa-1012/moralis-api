import { useMoralis } from "react-moralis";
import "./App.css";
import { DisplayComponent } from "./components/DisplayComponent";
import { Header } from "./components/Header";
// import { InputComponent } from "./components/InputComponent";

function App() {
  const {
    Moralis,
    logout,
    enableWeb3,
    isInitialized,
    isWeb3Enabled,
    authenticate,
    isAuthenticated,
    user,
  } = useMoralis();

  // if (!isAuthenticated) {
  // if (isAuthenticated) {
  //   return (
  //     <div>
  //       <button onClick={() => authenticate()}>Authenticate</button>
  //     </div>
  //   );
  // }
  return (
    <div className="App bg-main-background bg-contain bg-opacity-100 min-h-screen bg-cover">
      <div className="bg-blue-600 min-h-screen bg-opacity-75">
        <Header />
        {/* <h1>Welcome {user.get("username")}</h1> */}
        {/* <InputComponent /> */}
        <DisplayComponent />
        {/* <h1>Welcome {user.get("username")}</h1> */}
      </div>
    </div>
  );
}

export default App;
