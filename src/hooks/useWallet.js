import { useState, useEffect } from "react";

export function useWallet() {
  const [balances, setBalances] = useState({ raaskoin: 0, raastoken: 0 });

  useEffect(() => {
    // Fetch from Raaswallet or Oracle later
    setBalances({ raaskoin: 10234, raastoken: 85000 });
  }, []);

  return balances;
}
