import React, {useEffect, useState} from "react"
import axios from 'axios';
import EkranStartowy from "./components/EkranStartowy";

function App() {

  // const [backendData, setBackendData] = useState({ users: [] });

  // const getData = async () => {
  //   try {
  //     const res = await axios.get("/api");
  //     setBackendData(res.data);
  //   } catch (error) {
  //     console.error('Błąd pobierania danych:', error);
  //   }
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <>
      <EkranStartowy />
      {/* <div>
        {backendData.users.length === 0 ? (
          <p>Loading...</p>
        ) : (
          backendData.users.map((user, i) => (
            <p key={i}>{user}</p>
          ))
        )}
      </div> */}
    </>
  );
}
export default App;

