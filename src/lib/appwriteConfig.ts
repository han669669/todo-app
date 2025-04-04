import { Client, Account, Databases, Query, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { Query, ID };

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const TODOS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TODOS_COLLECTION_ID;

export default client;