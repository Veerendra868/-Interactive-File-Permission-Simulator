import React from 'react';
import { File, Folder, User, Users } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { formatPermissions } from '../utils/permissions';

export function FileSystem() {
  const { files, selectedFile, selectFile } = useFiles();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <Folder className="w-5 h-5 mr-2" />
          File System
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Click any file to modify its permissions
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => selectFile(file)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedFile?.id === file.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    file.type === 'directory' 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                      : 'bg-gray-100 dark:bg-slate-700'
                  }`}>
                    {file.type === 'directory' ? (
                      <Folder className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <File className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{file.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{file.group}</span>
                      </div>
                      {file.size && (
                        <span>{(file.size / 1024).toFixed(1)}KB</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                    {formatPermissions(file.permissions)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatPermissions(file.permissions, 'numeric')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            💡 <strong>Tip:</strong> Select a file above to start experimenting with chmod, chown, and see live command previews!
          </p>
        </div>
      </div>
    </div>
  );
}