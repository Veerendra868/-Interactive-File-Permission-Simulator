import React, { useState } from 'react';
import { User, Users, Crown, HelpCircle } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { Tooltip } from './Tooltip';

export function OwnershipEditor() {
  const { selectedFile, updateFileOwnership } = useFiles();
  const [newOwner, setNewOwner] = useState(selectedFile?.owner || '');
  const [newGroup, setNewGroup] = useState(selectedFile?.group || '');

  const commonUsers = ['alice', 'bob', 'charlie', 'root', 'www-data', 'nobody'];
  const commonGroups = ['staff', 'admin', 'developers', 'users', 'wheel', 'www-data'];

  React.useEffect(() => {
    if (selectedFile) {
      setNewOwner(selectedFile.owner);
      setNewGroup(selectedFile.group);
    }
  }, [selectedFile]);

  const handleOwnershipChange = () => {
    if (selectedFile) {
      updateFileOwnership(selectedFile.id, newOwner, newGroup);
    }
  };

  if (!selectedFile) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          File Ownership
        </h3>
        <Tooltip content="Change who owns this file and which group it belongs to">
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
            <label className="font-medium text-gray-900 dark:text-white">
              Owner
            </label>
          </div>
          
          <div>
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white transition-colors"
              placeholder="Enter username"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => setNewOwner(user)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    newOwner === user
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-600'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer'
                  }`}
                >
                  {user}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <label className="font-medium text-gray-900 dark:text-white">
              Group
            </label>
          </div>
          
          <div>
            <input
              type="text"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white transition-colors"
              placeholder="Enter group name"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setNewGroup(group)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    newGroup === group
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Current: <span className="font-mono text-blue-600 dark:text-blue-400">
            {selectedFile.owner}:{selectedFile.group}
          </span>
        </div>
        
        {(newOwner !== selectedFile.owner || newGroup !== selectedFile.group) && (
          <button
            onClick={handleOwnershipChange}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Apply Changes
          </button>
        )}
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> In real systems, only the file owner (or root) can change ownership.
          Group ownership can usually only be changed to groups the user belongs to.
        </p>
      </div>
    </div>
  );
}