'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { Styledroot } from './Styledroot'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Styledroot>{children}</Styledroot>
    </Provider>
  )
}
