import { useMoralis } from "react-moralis";
import "./App.css";
import { Header } from "./components/Header";

function App() {
  const { authenticate, isAuthenticated, user } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }
  return (
    <div className="App bg-main-background min-h-screen bg-cover">
      <Header />
      <h1>Welcome {user.get("username")}</h1>
    </div>
  );
}

export default App;
