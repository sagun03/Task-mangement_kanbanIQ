import { KanbanBoard, Priority, User } from '@/types/kanban';

// Mock users
export const mockUsers: Record<string, User> = {
  user1: {
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=9b87f5&color=fff',
  },
  user2: {
    id: 'user2',
    name: 'Sarah Chen',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=FF9F76&color=fff',
  },
  user3: {
    id: 'user3',
    name: 'Miguel Rodriguez',
    avatar: 'https://ui-avatars.com/api/?name=Miguel+Rodriguez&background=5690FF&color=fff',
  },
  user4: {
    id: 'user4',
    name: 'Emma Williams',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Williams&background=2ECF94&color=fff',
  },
};

// Generate mock data for the Kanban board
export const initialData: KanbanBoard = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create wireframes for dashboard',
      description: 'Create low-fidelity wireframes for the analytics dashboard. Include all major components and interaction states.',
      priority: 'high' as Priority,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user1, mockUsers.user2],
      comments: [
        {
          id: 'comment-1',
          author: mockUsers.user3,
          content: 'Let me know if you need any help with the user flow!',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
      tags: ['design', 'ux'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-1',
    },
    'task-2': {
      id: 'task-2',
      title: 'Implement authentication flow',
      description: 'Set up user authentication with email and social login options. Include password reset functionality.',
      priority: 'high' as Priority,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user3],
      comments: [],
      tags: ['backend', 'security'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-1',
    },
    'task-3': {
      id: 'task-3',
      title: 'Design system components',
      description: 'Create a library of reusable UI components following our brand guidelines.',
      priority: 'medium' as Priority,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user2],
      comments: [
        {
          id: 'comment-2',
          author: mockUsers.user1,
          content: 'Make sure to include dark mode variants!',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      tags: ['design', 'ui'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-2',
    },
    'task-4': {
      id: 'task-4',
      title: 'Optimize image loading',
      description: 'Implement lazy loading and image optimization to improve page performance.',
      priority: 'low' as Priority,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user3, mockUsers.user4],
      comments: [],
      tags: ['performance', 'frontend'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-2',
    },
    'task-5': {
      id: 'task-5',
      title: 'Write API documentation',
      description: 'Create comprehensive documentation for all API endpoints with examples.',
      priority: 'medium' as Priority,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user1],
      comments: [],
      tags: ['documentation', 'backend'],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-2',
    },
    'task-6': {
      id: 'task-6',
      title: 'Implement dark mode',
      description: 'Add dark mode support across all pages and components.',
      priority: 'low' as Priority,
      dueDate: null,
      assignees: [mockUsers.user2, mockUsers.user4],
      comments: [
        {
          id: 'comment-3',
          author: mockUsers.user4,
          content: 'I\'ve created some initial designs for this. Will share soon!',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      tags: ['ui', 'frontend'],
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-3',
    },
    'task-7': {
      id: 'task-7',
      title: 'Fix responsiveness issues',
      description: 'Address layout problems on mobile and tablet views across the app.',
      priority: 'high' as Priority,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignees: [mockUsers.user3],
      comments: [],
      tags: ['bug', 'ui'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      column: 'column-3',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4', 'task-5'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-6', 'task-7'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};
