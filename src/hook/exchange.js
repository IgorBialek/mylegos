import { createContext, useContext, useState } from "react";

const exchangeContext = createContext();

export default function useExchange() {
  return useContext(exchangeContext);
}

export function ExchangeProvider(props) {
  const [exchange, setExchange] = useState(null);

  const getExchange = async () => {
    let response = await fetch("https://open.er-api.com/v6/latest/EUR");
    let responseJSON = await response.json();
    setExchange(responseJSON);
  };

  const value = { exchange, getExchange };

  return <exchangeContext.Provider value={value} {...props} />;
}
