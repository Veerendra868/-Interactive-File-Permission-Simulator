import { FileItem } from '../contexts/FileContext';

export function formatPermissions(
  permissions: FileItem['permissions'],
  format: 'symbolic' | 'numeric' = 'symbolic'
): string {
  if (format === 'numeric') {
    let numeric = 0;
    
    // Owner permissions
    if (permissions.user.read) numeric += 400;
    if (permissions.user.write) numeric += 200;
    if (permissions.user.execute) numeric += 100;
    
    // Group permissions
    if (permissions.group.read) numeric += 40;
    if (permissions.group.write) numeric += 20;
    if (permissions.group.execute) numeric += 10;
    
    // Other permissions
    if (permissions.other.read) numeric += 4;
    if (permissions.other.write) numeric += 2;
    if (permissions.other.execute) numeric += 1;
    
    return numeric.toString().padStart(3, '0');
  }
  
  // Symbolic format
  const formatGroup = (perms: { read: boolean; write: boolean; execute: boolean }) => {
    return [
      perms.read ? 'r' : '-',
      perms.write ? 'w' : '-',
      perms.execute ? 'x' : '-'
    ].join('');
  };
  
  return formatGroup(permissions.user) + formatGroup(permissions.group) + formatGroup(permissions.other);
}

export function parseNumericPermissions(numeric: string): FileItem['permissions'] {
  const num = parseInt(numeric, 8);
  
  return {
    user: {
      read: (num & 0o400) !== 0,
      write: (num & 0o200) !== 0,
      execute: (num & 0o100) !== 0
    },
    group: {
      read: (num & 0o040) !== 0,
      write: (num & 0o020) !== 0,
      execute: (num & 0o010) !== 0
    },
    other: {
      read: (num & 0o004) !== 0,
      write: (num & 0o002) !== 0,
      execute: (num & 0o001) !== 0
    }
  };
}