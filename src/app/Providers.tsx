'use client'

import { Provider } from 'react-redux'
import { store, persistor } from './store' // ⬅️ IMPORTANTE
import { PersistGate } from 'redux-persist/integration/react'
import { Styledroot } from './Styledroot'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Styledroot>{children}</Styledroot>
      </PersistGate>
    </Provider>
  )
}
