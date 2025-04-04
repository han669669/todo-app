## Project Plan and Overview

**Project Summary:**

This project is a React-based Todo application built using Vite, TypeScript, and Tailwind CSS. It incorporates HeroUI components for styling and UI elements, and `@dnd-kit` for drag-and-drop functionality to reorder todo items. The application includes authentication (login/signup) and a dashboard to manage todos, with data persistence through Appwrite backend services.

**Key Components:**

* **`src/App.tsx`**: The main application component that sets up routing using `react-router-dom`. It defines routes for landing page, authentication, and the dashboard, and uses `AuthProvider` for managing authentication context.

* **`src/pages/landing/index.tsx`**: The landing page component, presenting information about the TodoApp and offering login/signup options.

* **`src/pages/auth/login.tsx` & `signup.tsx`**: Components for user authentication (login and signup). They use `AuthContext` to handle authentication logic and HeroUI components for the UI.

* **`src/pages/dashboard/index.tsx`**: The main dashboard component, which is a private route. It includes:
  - Input for adding new todos
  - `TodoList` component to display and manage the list of todos
  - Integration with Appwrite for data persistence

* **`src/components/todo-list.tsx`**: Component responsible for rendering the list of todos. It uses `@dnd-kit` for drag-and-drop reordering and renders `SortableTodoItem` for each todo.

* **`src/components/sortable-todo-item.tsx`**: Component for individual todo items in the list, making them sortable. It includes functionalities to toggle completion, edit, and delete todos.

* **`src/contexts/auth-context.tsx`**: Provides the authentication context using React Context API. It manages user authentication state (login, signup, logout) and makes it available to other components.

* **`src/hooks/use-todos.ts`/`useTodos.ts`**: Custom hooks to manage todo items state and logic (add, toggle, delete, reorder, edit). Uses Appwrite for data persistence.

* **`src/layouts/auth-layout.tsx`**: Layout component for authentication pages (login/signup), centering the content on the screen.

* **`src/types/todo.ts`**: TypeScript interface defining the structure of a `Todo` object.

**Additional Components:**

* **`src/components/private-route.tsx`**: Protected route component that:
  - Integrates with auth context
  - Supports role-based access control
  - Shows loading state during auth checks
  - Handles both authentication and authorization

* **`src/components/loading-indicator.tsx`**: Reusable loading spinner with:
  - Multiple size options
  - Full-screen or inline display
  - Customizable loading message

* **`src/lib/appwriteConfig.ts`**: Appwrite service configuration:
  - Sets up Client with endpoint and project ID
  - Exports Account and Databases services
  - Defines database and collection IDs

* **`src/utils/migrateTodos.ts`**: Data migration utility that:
  - Handles migration from local storage to Appwrite
  - Cleans existing data before migration
  - Transforms todo format for persistence

**Data Flow:**

* **Authentication Flow:**
  1. User credentials handled by AuthContext
  2. Appwrite Account service manages auth state
  3. PrivateRoute protects dashboard access
  4. LoadingIndicator shows during auth checks

* **Todo Data Flow:**
  1. useTodos hook manages state
  2. Appwrite Databases service persists data
  3. TodoList renders and sorts items
  4. SortableTodoItem handles individual actions
  5. migrateTodos utility enables data migration

**Next Steps:**

1. **Appwrite Integration:**
   - Implement additional Appwrite services (Storage, Functions)
   - Enhance permission system with roles/labels
   - Add offline-first capabilities

2. **Feature Implementation:**
   - Add categories, due dates, or priority levels
   - Implement sharing/collaboration features
   - Add search/filter capabilities

3. **UI/UX Improvements:**
   - Enhance loading states
   - Add animations/transitions
   - Improve mobile responsiveness

4. **Testing & Quality:**
   - Expand test coverage
   - Implement CI/CD pipeline
   - Add error monitoring
