import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
} from "@material-ui/core";
import "@fontsource/roboto";
import "./options.css";
import {
  LocalStorageOptions,
  getStoredOptions,
  setStoredOptions,
} from "../utils/storage";

const Option: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  useEffect(() => {
    getStoredOptions().then((opts) => setOptions(opts));
  }, []);

  const handleCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity,
    });
  };

  const handleSave = () => {
    setStoredOptions(options);
  };

  const handleOverLaychange = (hasAuthoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAuthoOverlay,
    });
  };

  if (!options) return null;

  return (
    <Box mx="20%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Weather Extension</Typography>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                placeholder="Enter a home city"
                value={options.homeCity}
                onChange={(e) => handleCityChange(e.target.value)}
              />
            </Grid>
            <Switch
              color="primary"
              checked={options.hasAuthoOverlay}
              onChange={(e, checked) => handleOverLaychange(checked)}
            />
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const appContainer = document.createElement("div");
document.body.appendChild(appContainer);
const root = createRoot(appContainer);
root.render(<Option />);
