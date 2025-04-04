import { databases, DATABASE_ID, TODOS_COLLECTION_ID } from '../lib/appwriteConfig';
import { ID, Query } from 'appwrite';

export async function migrateLocalTodosToAppwrite(localTodos: any[], userId: string) {
  if (!localTodos.length) return;
  
  try {
    // Delete existing todos for clean migration
    const existing = await databases.listDocuments(DATABASE_ID, TODOS_COLLECTION_ID, [
      Query.equal('userId', userId)
    ]);
    
    await Promise.all(existing.documents.map(doc => 
      databases.deleteDocument(DATABASE_ID, TODOS_COLLECTION_ID, doc.$id)
    ));

    // Import local todos
    await Promise.all(localTodos.map(todo => 
      databases.createDocument(
        DATABASE_ID, 
        TODOS_COLLECTION_ID,
        ID.unique(),
        {
          title: todo.title,
          completed: todo.completed || false,
          userId
        }
      )
    ));

    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}