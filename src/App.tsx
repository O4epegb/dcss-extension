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
      DCSS Webtiles Extension
      <hr />
      <div>
        <button onClick={() => browser.storage.sync.clear()}>Clear browser cache</button>
      </div>
    </main>
  )
}

export default App
