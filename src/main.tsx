import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { isSupabaseConfigured } from './lib/supabase'

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: 20, color: 'red'}}><h1>Error</h1><pre>{String(this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

function ConfigMissing() {
  return (
    <div style={{
      maxWidth: 720,
      margin: '64px auto',
      padding: 24,
      fontFamily: 'Inter, system-ui, sans-serif',
      border: '1px solid #f0c674',
      background: '#fff8e1',
      borderRadius: 8,
      color: '#5b3a00',
    }}>
      <h1 style={{ marginTop: 0 }}>Configuration required</h1>
      <p>The site cannot start because Supabase credentials are missing.</p>
      <p>Set the following environment variables on your Netlify site, then redeploy:</p>
      <ul>
        <li><code>VITE_SUPABASE_URL</code></li>
        <li><code>VITE_SUPABASE_ANON_KEY</code></li>
      </ul>
      <p style={{ marginBottom: 0 }}>
        In Netlify: <em>Site settings → Environment variables → Add a variable</em>, then trigger a new deploy.
      </p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {isSupabaseConfigured ? (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      ) : (
        <ConfigMissing />
      )}
    </ErrorBoundary>
  </StrictMode>,
)
