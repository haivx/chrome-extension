import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto";
import { Box, InputBase, IconButton, Paper, Grid } from "@material-ui/core";
import { Add as AddIcon, PictureInPicture } from "@material-ui/icons";
import "./popup.css";
import { fetchOpenWeatherData } from "../utils/api";
import { WeatherCard } from "../components/WeatherCard";
import {
  setStoredCities,
  getStoredCities,
  LocalStorageOptions,
  getStoredOptions,
  setStoredOptions,
} from "../utils/storage";
import { Messages } from "../utils/messages";

const Popup: React.FC<{}> = () => {
  const [cities, setCities] = useState(["Toronto", "New York"]);
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  useEffect(() => {
    fetchOpenWeatherData("Toronto", "metric")
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    getStoredCities().then((cities) => setCities(cities));
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const [cityInput, setCityInput] = useState("");

  const handleCityBtnClick = () => {
    if (cityInput === "") return;
    const updatedCities = [...cities, cityInput];
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
      setCityInput("");
    });
  };

  const handleCityDeletBtbClick = (idx) => {
    cities.splice(idx, 1);
    const updatedCities = [...cities];
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
    });
  };

  const handleTempScaleBtnClick = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === "metric" ? "imperial" : "metric",
    };
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions);
    });
  };

  const handleOverlayBtnClick = () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
          window.close();
        }
      }
    );
  };

  if (!options) return null;

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <IconButton onClick={handleCityBtnClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleOverlayBtnClick}>
                <PictureInPicture />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <IconButton onClick={handleTempScaleBtnClick}>
                {options.tempScale === "metric" ? "\u2103" : "\u2109"}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity !== "" && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          key={city}
          tempScale={options.tempScale}
          onDelete={() => {
            handleCityDeletBtbClick(index);
          }}
        />
      ))}
      <Box height="16px" />
    </Box>
  );
};

const appContainer = document.createElement("div");
document.body.appendChild(appContainer);
const root = createRoot(appContainer);
root.render(<Popup />);
