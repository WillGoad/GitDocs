import React from 'react';
import './App.css';
import RichTextCanvas from './components/richtext';
import { CanvasContainerFlex, CanvasContainerInner } from './App.styled';

function App() {
  return (
    <div className="App">
      <CanvasContainerFlex>
        <CanvasContainerInner>
          <RichTextCanvas />
        </CanvasContainerInner>
      </CanvasContainerFlex>
    </div>
  );
}

export default App;
