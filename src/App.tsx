import React from 'react'
import { browser } from 'webextension-polyfill-ts'

function App() {
  return (
    <main
      className="App"
      style={{
        width: '300px',
      }}
    >
      DCSS Stats Webtiles Extension
      <hr />
      <div>
        <button onClick={() => browser.storage.local.clear()}>Clear extension cache</button>
      </div>
    </main>
  )
}

export default App
