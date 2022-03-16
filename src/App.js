import "./App.css";
import backgroundImg from "./assets/images/background.jpg";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <img className="w-screen h-screen" src={backgroundImg} alt="background" />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="p-5">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link text-2xl font-bold underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
