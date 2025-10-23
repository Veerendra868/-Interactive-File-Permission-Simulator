import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { formatPermissions } from '../utils/permissions';

export function CommandPreview() {
  const { selectedFile, umask } = useFiles();
  const [copiedCommand, setCopiedCommand] = React.useState<string | null>(null);

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  if (!selectedFile) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Command Preview
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Select a file to see live command previews
        </p>
      </div>
    );
  }

  const numericPerms = formatPermissions(selectedFile.permissions, 'numeric');
  const symbolicPerms = formatPermissions(selectedFile.permissions);

  const commands = [
    {
      title: 'Set permissions (numeric)',
      command: `chmod ${numericPerms} ${selectedFile.name}`,
      description: 'Change permissions using octal notation'
    },
    {
      title: 'Set permissions (symbolic)',
      command: `chmod u=${symbolicPerms.slice(0, 3).replace(/-/g, '')},g=${symbolicPerms.slice(3, 6).replace(/-/g, '')},o=${symbolicPerms.slice(6, 9).replace(/-/g, '')} ${selectedFile.name}`,
      description: 'Change permissions using symbolic notation'
    },
    {
      title: 'Change ownership',
      command: `chown ${selectedFile.owner}:${selectedFile.group} ${selectedFile.name}`,
      description: 'Change file owner and group'
    },
    {
      title: 'Set umask',
      command: `umask ${umask}`,
      description: 'Set default permissions for new files'
    },
    {
      title: 'View permissions',
      command: `ls -l ${selectedFile.name}`,
      description: 'Display detailed file information'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Live Command Preview</h3>
        </div>
        <p className="text-green-100 text-sm mt-1">
          Commands update automatically as you modify permissions
        </p>
      </div>

      <div className="p-6 space-y-4">
        {commands.map((cmd, index) => (
          <div
            key={index}
            className="p-4 bg-gray-900 dark:bg-slate-900 rounded-lg border border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  {cmd.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {cmd.description}
                </p>
              </div>
              
              <button
                onClick={() => copyCommand(cmd.command)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                title="Copy command"
              >
                {copiedCommand === cmd.command ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="font-mono text-green-400 bg-black p-3 rounded text-sm overflow-x-auto">
              <span className="text-gray-500">$ </span>
              {cmd.command}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Current File Status
          </h4>
          <div className="font-mono text-sm space-y-1">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">Name:</span> {selectedFile.name}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">Type:</span> {selectedFile.type}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">Owner:</span> {selectedFile.owner}:{selectedFile.group}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">Permissions:</span> {symbolicPerms} ({numericPerms})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}