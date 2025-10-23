import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  owner: string;
  group: string;
  permissions: {
    user: { read: boolean; write: boolean; execute: boolean };
    group: { read: boolean; write: boolean; execute: boolean };
    other: { read: boolean; write: boolean; execute: boolean };
  };
  size?: number;
  modified?: Date;
}

interface FileContextType {
  files: FileItem[];
  selectedFile: FileItem | null;
  umask: string;
  selectFile: (file: FileItem) => void;
  updateFilePermissions: (fileId: string, permissions: FileItem['permissions']) => void;
  updateFileOwnership: (fileId: string, owner: string, group: string) => void;
  setUmask: (umask: string) => void;
  createFile: (name: string, type: 'file' | 'directory') => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}

const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'document.txt',
    type: 'file',
    owner: 'alice',
    group: 'staff',
    size: 2048,
    modified: new Date('2024-01-15'),
    permissions: {
      user: { read: true, write: true, execute: false },
      group: { read: true, write: false, execute: false },
      other: { read: true, write: false, execute: false }
    }
  },
  {
    id: '2',
    name: 'script.sh',
    type: 'file',
    owner: 'bob',
    group: 'developers',
    size: 1024,
    modified: new Date('2024-01-20'),
    permissions: {
      user: { read: true, write: true, execute: true },
      group: { read: true, write: false, execute: true },
      other: { read: false, write: false, execute: false }
    }
  },
  {
    id: '3',
    name: 'project',
    type: 'directory',
    owner: 'alice',
    group: 'developers',
    modified: new Date('2024-01-22'),
    permissions: {
      user: { read: true, write: true, execute: true },
      group: { read: true, write: false, execute: true },
      other: { read: true, write: false, execute: true }
    }
  },
  {
    id: '4',
    name: 'config.json',
    type: 'file',
    owner: 'root',
    group: 'admin',
    size: 512,
    modified: new Date('2024-01-10'),
    permissions: {
      user: { read: true, write: true, execute: false },
      group: { read: true, write: false, execute: false },
      other: { read: false, write: false, execute: false }
    }
  },
  {
    id: '5',
    name: 'logs',
    type: 'directory',
    owner: 'system',
    group: 'admin',
    modified: new Date('2024-01-25'),
    permissions: {
      user: { read: true, write: true, execute: true },
      group: { read: true, write: true, execute: true },
      other: { read: false, write: false, execute: false }
    }
  }
];

interface FileProviderProps {
  children: React.ReactNode;
}

export function FileProvider({ children }: FileProviderProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [umask, setUmaskValue] = useState<string>('022');

  const selectFile = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const updateFilePermissions = useCallback((fileId: string, permissions: FileItem['permissions']) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, permissions } : file
    ));
    
    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? { ...prev, permissions } : null);
    }
  }, [selectedFile]);

  const updateFileOwnership = useCallback((fileId: string, owner: string, group: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, owner, group } : file
    ));
    
    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? { ...prev, owner, group } : null);
    }
  }, [selectedFile]);

  const setUmask = useCallback((newUmask: string) => {
    setUmaskValue(newUmask);
  }, []);

  const createFile = useCallback((name: string, type: 'file' | 'directory') => {
    const umaskValue = parseInt(umask, 8);
    const defaultPerms = type === 'directory' ? 0o777 : 0o666;
    const actualPerms = defaultPerms & ~umaskValue;

    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type,
      owner: 'user',
      group: 'staff',
      size: type === 'file' ? 0 : undefined,
      modified: new Date(),
      permissions: {
        user: {
          read: (actualPerms & 0o400) !== 0,
          write: (actualPerms & 0o200) !== 0,
          execute: (actualPerms & 0o100) !== 0
        },
        group: {
          read: (actualPerms & 0o040) !== 0,
          write: (actualPerms & 0o020) !== 0,
          execute: (actualPerms & 0o010) !== 0
        },
        other: {
          read: (actualPerms & 0o004) !== 0,
          write: (actualPerms & 0o002) !== 0,
          execute: (actualPerms & 0o001) !== 0
        }
      }
    };

    setFiles(prev => [...prev, newFile]);
  }, [umask]);

  return (
    <FileContext.Provider value={{
      files,
      selectedFile,
      umask,
      selectFile,
      updateFilePermissions,
      updateFileOwnership,
      setUmask,
      createFile
    }}>
      {children}
    </FileContext.Provider>
  );
}