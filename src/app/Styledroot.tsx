"use client"

import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./theme"
import { Provider } from "react-redux"
import { store } from "./store" // ajuste o caminho se necessário

export function Styledroot({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  )
}
