import React from "react";
import "./App.css";
import Hero from "./components/Hero"
import Header from "./components/Header"
import Footer from "./components/Footer"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: [
        'Roboto',
        'sans-serif',
      ].join(','),
    },});

function App() {
    return (
      <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Hero />
        <Footer />
        </ThemeProvider>
      </>
  
    );
  }

export default App;
