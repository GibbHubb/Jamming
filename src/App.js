import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Login from "./components/Login";
import Logout from "./components/Logout";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

function App() {
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    setTracks([]); // Clear the tracks state
    window.localStorage.removeItem("token");
  };

  const searchSongs = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "track",
      },
    });
    setTracks(data.tracks.items);
    console.log(tracks);
  };

  const renderSongs = () => {
    return tracks.map((track) => (
      <Card key={track.id}>
        {track.album.images ? (
          <img width={"100%"} src={track.album.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {track.name}
      </Card>
    ));
  };

  return (
    <div className="App">
      <h1>Welcome to my Spotify app</h1>
      {token ? <Logout logout={logout} /> : <Login />}

      {token && (
        <form onSubmit={searchSongs}>
          <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
          <button type={"submit"}>Search</button>
        </form>
      )}

      {renderSongs()}
    </div>
  );
}

export default App;

