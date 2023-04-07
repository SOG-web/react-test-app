import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ChatScreen } from './components/chat/chat';

function App() {
  return (
    <div className='App'>
      <h1>Vite + React Test App by ROU Technology</h1>
      <ChatScreen />
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
