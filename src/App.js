import styles from "./App.module.css"
import { useState, useEffect} from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([])
  const [majorCoins, setMajorCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers").then(response => 
    response.json()
    ).then(json => {
      setCoins(json);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const filteredCoins = coins.filter(coin => 
        coin.symbol === "BTC" || 
        coin.symbol === "ETH" || 
        coin.symbol === "BNB" || 
        coin.symbol === "USDT" || 
        coin.symbol === "SOL" || 
        coin.symbol === "XRP"
      );
      setMajorCoins(filteredCoins);
    }
  }, [loading]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const results = coins.filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>The Coins! {loading ? "" : `(${coins.length})`}</h1>
      {loading ? (<strong>Loading...</strong>) : (
      <div>
      

      <select>
        {coins.map((coin) => (
        <option>
          {coin.name} ({coin.symbol}): ${coin.quotes.USD.price} USD
          </option>
          ))}
      </select><br /><br /><br />
      <strong>직접검색 (BTC, XRP ... )</strong>
      <input
        type="text"
        placeholder="Search coins..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const result = searchResults.find(coin => coin.symbol.toLowerCase() === searchQuery.toLowerCase());
            if (result) {
              handleCoinSelect(result);
            }
          }
        }}
      />
      {selectedCoin && (
        <p>{selectedCoin.name} ({selectedCoin.symbol}): ${selectedCoin.quotes.USD.price} USD</p>
      )}

      <div className={styles["search-result"]}>
        {searchResults.map((coin) => (
          <div key={coin.id} className={styles["search-result-item"]}>
            <p>{coin.name} ({coin.symbol}): ${coin.quotes.USD.price} USD</p>
          </div>
        ))}
      </div>

      </div>
      )}


      <h2><br />Major Coins</h2><br />
    <div className={styles["grid-container"]}>
        {majorCoins.map((coin, index) => (
          <div className={styles["major-coin-item"]}>
            <h3>{coin.name} ({coin.symbol})</h3>
            <p>${coin.quotes.USD.price.toFixed(2)} USD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
