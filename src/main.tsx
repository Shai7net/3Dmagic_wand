import {StrictMode} from 'react';
import {createRoot, Root} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

let appRoot: Root | null = null;

(window as any).HayotzerShot3 = {
  init: ({ root, onOpenVideo, mobile }: { root: HTMLElement, onOpenVideo?: Function, mobile?: boolean }) => {
    if (appRoot) return; // Prevent double init
    
    // Wire up global callbacks for the app to use
    if (onOpenVideo) {
      (window as any).openShot3Video = onOpenVideo;
    }
    
    appRoot = createRoot(root);
    appRoot.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  },
  start: () => {
    // Already started by init in this React architecture
  },
  stop: () => {
    // Not implemented for React
  },
  destroy: () => {
    if (appRoot) {
      appRoot.unmount();
      appRoot = null;
    }
  }
};

// Fallback for AI Studio preview: simply render into standard root if available and we aren't embedded
const aiStudioRoot = document.getElementById('root');
if (aiStudioRoot) {
  appRoot = createRoot(aiStudioRoot);
  appRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
