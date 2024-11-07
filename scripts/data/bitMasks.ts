/**
 * If a "typedef" is a bitmask, add it here.
 */
export const bitMasks: Record<string, string[]> = {
  AclMode: [
    'ACL_NO_RIGHTS',
    'ACL_INSERT',
    'ACL_SELECT',
    'ACL_UPDATE',
    'ACL_DELETE',
    'ACL_TRUNCATE',
    'ACL_REFERENCES',
    'ACL_TRIGGER',
    'ACL_EXECUTE',
    'ACL_USAGE',
    'ACL_CREATE',
    'ACL_CREATE_TEMP',
    'ACL_CONNECT',
    'ACL_SET',
    'ACL_ALTER_SYSTEM',
  ],
}
