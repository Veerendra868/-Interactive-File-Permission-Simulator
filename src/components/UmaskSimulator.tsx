import React, { useState } from 'react';
import { Zap, Plus, File, Folder, HelpCircle } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { Tooltip } from './Tooltip';

export function UmaskSimulator() {
  const { umask, setUmask, createFile } = useFiles();
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'directory'>('file');

  const handleUmaskChange = (value: string) => {
    // Validate octal input
    if (/^[0-7]{3}$/.test(value) || value === '') {
      setUmask(value);
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim(), newFileType);
      setNewFileName('');
    }
  };

  const calculatePermissions = (isDirectory: boolean) => {
    const umaskValue = parseInt(umask || '000', 8);
    const defaultPerms = isDirectory ? 0o777 : 0o666;
    const actualPerms = defaultPerms & ~umaskValue;
    
    return {
      octal: actualPerms.toString(8).padStart(3, '0'),
      symbolic: permissionsToSymbolic(actualPerms)
    };
  };

  const permissionsToSymbolic = (perms: number) => {
    const owner = [
      (perms & 0o400) ? 'r' : '-',
      (perms & 0o200) ? 'w' : '-',
      (perms & 0o100) ? 'x' : '-'
    ].join('');
    
    const group = [
      (perms & 0o040) ? 'r' : '-',
      (perms & 0o020) ? 'w' : '-',
      (perms & 0o010) ? 'x' : '-'
    ].join('');
    
    const other = [
      (perms & 0o004) ? 'r' : '-',
      (perms & 0o002) ? 'w' : '-',
      (perms & 0o001) ? 'x' : '-'
    ].join('');
    
    return `${owner}${group}${other}`;
  };

  const filePerms = calculatePermissions(false);
  const dirPerms = calculatePermissions(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Umask Simulator
        </h3>
        <Tooltip content="Umask determines default permissions for newly created files and directories">
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Umask Value
            </label>
            <input
              type="text"
              value={umask}
              onChange={(e) => handleUmaskChange(e.target.value)}
              className="w-full px-3 py-2 text-center font-mono text-lg border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white transition-colors"
              placeholder="022"
              maxLength={3}
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Default Permissions Preview
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New files:</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-blue-600 dark:text-blue-400">{filePerms.symbolic}</span>
                  <span className="text-gray-500 ml-2">({filePerms.octal})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New directories:</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-blue-600 dark:text-blue-400">{dirPerms.symbolic}</span>
                  <span className="text-gray-500 ml-2">({dirPerms.octal})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Test File Creation
          </h4>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                newFileType === 'file'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <File className="w-4 h-4" />
              <span>File</span>
            </button>
            <button
              onClick={() => setNewFileType('directory')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                newFileType === 'directory'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Directory</span>
            </button>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={`Enter ${newFileType} name`}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
            />
            <button
              onClick={handleCreateFile}
              disabled={!newFileName.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Common Umask Values
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: '022', desc: 'Standard (755/644)' },
            { value: '002', desc: 'Group writable (775/664)' },
            { value: '077', desc: 'Private (700/600)' },
            { value: '000', desc: 'No restrictions (777/666)' }
          ].map(({ value, desc }) => (
            <button
              key={value}
              onClick={() => setUmask(value)}
              className={`p-2 text-xs rounded-lg transition-colors ${
                umask === value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
              }`}
            >
              <div className="font-mono font-medium">{value}</div>
              <div>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}