import React, { useState } from 'react';
import { Shield, User, Users, Globe, Zap, HelpCircle } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { PermissionCheckbox } from './PermissionCheckbox';
import { OwnershipEditor } from './OwnershipEditor';
import { UmaskSimulator } from './UmaskSimulator';
import { Tooltip } from './Tooltip';

type Tab = 'chmod' | 'chown' | 'umask';

export function PermissionEditor() {
  const { selectedFile, updateFilePermissions } = useFiles();
  const [activeTab, setActiveTab] = useState<Tab>('chmod');

  if (!selectedFile) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          No file selected
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Choose a file from the file system to start modifying permissions
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'chmod' as Tab, label: 'Permissions (chmod)', icon: Shield },
    { id: 'chown' as Tab, label: 'Ownership (chown)', icon: User },
    { id: 'umask' as Tab, label: 'Umask', icon: Zap }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Editing: <span className="text-blue-600 dark:text-blue-400">{selectedFile.name}</span>
          </h2>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'chmod' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                File Permissions
              </h3>
              <Tooltip content="Set read, write, and execute permissions for different user categories">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PermissionGroup
                title="Owner (User)"
                subtitle="File owner permissions"
                icon={User}
                iconColor="text-green-600 dark:text-green-400"
                bgColor="bg-green-50 dark:bg-green-900/20"
                permissions={selectedFile.permissions.user}
                onChange={(newPerms) => {
                  const updatedPermissions = {
                    ...selectedFile.permissions,
                    user: newPerms
                  };
                  updateFilePermissions(selectedFile.id, updatedPermissions);
                }}
              />
              
              <PermissionGroup
                title="Group"
                subtitle="Group member permissions"
                icon={Users}
                iconColor="text-blue-600 dark:text-blue-400"
                bgColor="bg-blue-50 dark:bg-blue-900/20"
                permissions={selectedFile.permissions.group}
                onChange={(newPerms) => {
                  const updatedPermissions = {
                    ...selectedFile.permissions,
                    group: newPerms
                  };
                  updateFilePermissions(selectedFile.id, updatedPermissions);
                }}
              />
              
              <PermissionGroup
                title="Others"
                subtitle="Everyone else permissions"
                icon={Globe}
                iconColor="text-orange-600 dark:text-orange-400"
                bgColor="bg-orange-50 dark:bg-orange-900/20"
                permissions={selectedFile.permissions.other}
                onChange={(newPerms) => {
                  const updatedPermissions = {
                    ...selectedFile.permissions,
                    other: newPerms
                  };
                  updateFilePermissions(selectedFile.id, updatedPermissions);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'chown' && <OwnershipEditor />}
        {activeTab === 'umask' && <UmaskSimulator />}
      </div>
    </div>
  );
}

interface PermissionGroupProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  permissions: { read: boolean; write: boolean; execute: boolean };
  onChange: (permissions: { read: boolean; write: boolean; execute: boolean }) => void;
}

function PermissionGroup({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  permissions, 
  onChange 
}: PermissionGroupProps) {
  const { selectedFile } = useFiles();

  const handlePermissionChange = (type: 'read' | 'write' | 'execute', value: boolean) => {
    const newPermissions = { ...permissions, [type]: value };
    onChange(newPermissions);
  };

  return (
    <div className={`p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 ${bgColor}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <PermissionCheckbox
          label="Read (r)"
          description="View file contents"
          checked={permissions.read}
          onChange={(checked) => handlePermissionChange('read', checked)}
        />
        <PermissionCheckbox
          label="Write (w)"
          description="Modify file contents"
          checked={permissions.write}
          onChange={(checked) => handlePermissionChange('write', checked)}
        />
        <PermissionCheckbox
          label="Execute (x)"
          description={selectedFile?.type === 'directory' ? 'Access directory' : 'Run as program'}
          checked={permissions.execute}
          onChange={(checked) => handlePermissionChange('execute', checked)}
        />
      </div>
    </div>
  );
}