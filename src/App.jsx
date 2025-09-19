import { WalletProvider } from "./context/WalletContext";
import WalletActions from "./components/WalletActions";
import RunbookTimeline from "./components/RunbookTimeline";

function App() {
  return (
    <WalletProvider>
      <div className="App p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Connect a Wallet</h1>
        <WalletActions />

        <div className="mt-10">
          <RunbookTimeline />
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
