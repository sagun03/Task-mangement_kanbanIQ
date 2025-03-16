import { io, Socket } from 'socket.io-client';
import { Task } from '../data/Taskstype';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected for user:', userId);
      return;
    }

    this.socket = io('http://localhost:8082', {
      auth: { userId },
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket Connected ✅ for user:', userId);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket Connection Error ❌:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket Disconnected ⚠️. Reason:', reason);
    });
  }

  onTaskUpdate(callback: (task: Task) => void) {
    if (!this.socket) return;
    
    this.socket.off('taskUpdated'); // Remove existing listeners
    this.socket.on('taskUpdated', (updatedTask) => {
      console.log('📥 Socket received task update:', updatedTask);
      callback(updatedTask);
    });
  }

  emitTaskUpdate(taskData: Task) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }
    console.log('📤 Emitting task update:', taskData);
    this.socket.emit('taskUpdate', taskData);
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();