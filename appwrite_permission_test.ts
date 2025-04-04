// Testing Appwrite permission formats
const validPermissions = [
  "user:123", // Basic user permission
  "users", // All users
  "role:member", // Role-based
  "team:abc123", // Team-based
  "label:admin" // Label-based
];

// Based on Appwrite documentation, collection permissions should use:
// - "users" for all authenticated users
// - "user:[ID]" for specific users
// - Document-level permissions handle user-specific access