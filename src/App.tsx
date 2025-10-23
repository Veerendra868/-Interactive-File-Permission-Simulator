import React, { useState } from 'react';
import { FileSystem } from './components/FileSystem';
import { PermissionEditor } from './components/PermissionEditor';
import { CommandPreview } from './components/CommandPreview';
import { Header } from './components/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import { FileProvider } from './contexts/FileContext';

function App() {
  return (
    <ThemeProvider>
      <FileProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
          <Header />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <FileSystem />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <PermissionEditor />
                <CommandPreview />
              </div>
            </div>
          </main>
        </div>
      </FileProvider>
    </ThemeProvider>
  );
}

export default App;