/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useKanban } from "../context/KanbanContext";
import { ITask } from "../types/kanban";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
};

type ChatbotCommand = {
  keyword: string;
  description: string;
  handler: (params: string) => string | Promise<string>;
};

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const {
    tasks,
    getTasksByStatus,
    searchTasks,
    getTasksByUserId,
    getTasksByStatusByUserId,
  } = useKanban();
  // Initialize with a welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hi ${user.name || user.email}! I'm your task assistant. You can ask me about your tasks, search for specific tasks, or get summaries. Try commands like "show all tasks", "find design tasks", or "tasks due this week".`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  // Helper function to format task list as string
  const formatTaskList = (taskList: ITask[]): string => {
    if (taskList.length === 0) {
      return "I couldn't find any tasks matching your criteria.";
    }

    return taskList
      .map(
        (task) =>
          `• ${task.title} (${task.status}) - ${task.priority} priority${
            task.dueDate
              ? `, due on ${new Date(task.dueDate).toLocaleDateString()}`
              : ""
          }`
      )
      .join("\n\n");
  };

  // Define chatbot commands
  const commands: ChatbotCommand[] = [
    {
      keyword: "help",
      description: "Show available commands",
      handler: () => {
        return `
Here are some commands you can use:

• help - Show this help message
• show all tasks - List all your tasks
• show status [status] tasks - List tasks in a specific status (todo, in-progress, done)
• find [query] - Search for tasks containing specific text
• tasks due [period] - Show tasks due in a specific period (today, this week, this month)
• high priority tasks - Show tasks with high priority
        `;
      },
    },
    {
      keyword: "show all tasks",
      description: "List all tasks",
      handler: async () => {
        const tasks = await getTasksByUserId(user.id);
        return `Here are all your tasks:\n\n${formatTaskList(tasks)}`;
      },
    },
    {
      keyword: "show status",
      description: "List tasks in a specific status",
      handler: async (status) => {
        const tasks = await getTasksByUserId(user.id);
        const searchTerm = status.replace(/show status\s*/i, '').replace(/\s*tasks/i, '').trim();
        const statusTasks = await getTasksByStatusByUserId(tasks, [searchTerm]);
        return `Here are all your tasks:\n\n${formatTaskList(statusTasks)}`;
      },
    },
    {
      keyword: "show todo tasks",
      description: "List todo tasks",
      handler: async () => {
        const tasks = await getTasksByUserId(user.id);
        const todoTasks = await getTasksByStatusByUserId(tasks, [
          "todo",
          "to-do",
          "Todo",
          "To Do",
          "to do",
          "To do",
          "To-do",
          "To-Do",
          "TODO",
        ]);
        return `Here are your todo tasks:\n\n${formatTaskList(todoTasks)}`;
      },
    },
    {
      keyword: "show in-progress tasks",
      description: "List in-progress tasks",
      handler: async () => {
        const tasks = await getTasksByUserId(user.id);
        const todoTasks = await getTasksByStatusByUserId(tasks, [
          "in-progress",
          "In progress",
          "In-Progress",
          "in progress",
          "inprogress",
          "INPROGRESS",
          "IN-PROGRESS",
        ]);
        return `Here are your in-progress tasks:\n\n${formatTaskList(
          todoTasks
        )}`;
      },
    },
    {
      keyword: "show done tasks",
      description: "List done tasks",
      handler: async () => {
        const tasks = await getTasksByUserId(user.id);
        const doneTasks = await getTasksByStatusByUserId(tasks, [
          "done",
          "Done",
          "DONE",
          "DOne",
        ]);
        return `Here are your completed tasks:\n\n${formatTaskList(doneTasks)}`;
      },
    },
    {
      keyword: "find",
      description: "Search for tasks",
      handler: async (params) => {
        const tasks = await getTasksByUserId(user.id);
        const results = await searchTasks(params, tasks);
        return `Here are tasks matching "${params}":\n\n${formatTaskList(
          results
        )}`;
      },
    },
    {
      keyword: "tasks due today",
      description: "Show tasks due today",
      handler: async () => {
        const today = new Date().toISOString().split("T")[0];
        const tasks = await getTasksByUserId(user.id);
        const dueTodayTasks = tasks.filter((task) => (task.dueDate as string).split("T")[0] === today);
        return `Here are tasks due today:\n\n${formatTaskList(dueTodayTasks)}`;
      },
    },
    {
      keyword: "tasks due this week",
      description: "Show tasks due this week",
      handler: async () => {
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);
      
        const formatDate = (date: any) => date.toISOString().split("T")[0];
      
        const todayStr = formatDate(today);
        const oneWeekLaterStr = formatDate(oneWeekLater);
      
        const tasks = await getTasksByUserId(user.id);
      
        const dueThisWeekTasks = tasks.filter((task) => {
          if (!task.dueDate) return false;
      
          const dueDateStr = formatDate(new Date(task.dueDate));      
          return dueDateStr >= todayStr && dueDateStr <= oneWeekLaterStr;
        });

        return `Here are tasks due this week:\n\n${formatTaskList(
          dueThisWeekTasks
        )}`;
      },
    },
    {
      keyword: "high priority tasks",
      description: "Show high priority tasks",
      handler: async () => {
        const tasks = await getTasksByUserId(user.id);

        const highPriorityTasks = tasks.filter(
          (task) => task.priority === "high"
        );
        return `Here are your high priority tasks:\n\n${formatTaskList(
          highPriorityTasks
        )}`;
      },
    },
    {
      keyword: "summary",
      description: "Show a summary of tasks",
      handler: async () => {
        const todoCount = getTasksByStatus("todo").length;
        const inProgressCount = getTasksByStatus("in-progress").length;
        const doneCount = getTasksByStatus("done").length;
        const tasks = await getTasksByUserId(user.id);

        const highPriorityCount = tasks.filter(
          (task) => task.priority === "high"
        ).length;
        const mediumPriorityCount = tasks.filter(
          (task) => task.priority === "medium"
        ).length;
        const lowPriorityCount = tasks.filter(
          (task) => task.priority === "low"
        ).length;

        return `
Task Board Summary:

Total Tasks: ${tasks.length}

By Status:
• To Do: ${todoCount} tasks
• In Progress: ${inProgressCount} tasks
• Done: ${doneCount} tasks

By Priority:
• High: ${highPriorityCount} tasks
• Medium: ${mediumPriorityCount} tasks
• Low: ${lowPriorityCount} tasks
        `;
      },
    },
  ];

  const processMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Process the message and generate a response
      try {
        let response = "";
        const lowerCaseContent = content.toLowerCase().trim();

        // Check if the message matches any command
        let foundCommand = false;

        for (const command of commands) {
          if (lowerCaseContent === command.keyword) {
            response = await command.handler("");
            foundCommand = true;
            break;
          } else if (
            command.keyword !== "help" &&
            lowerCaseContent.startsWith(command.keyword)
          ) {
            const params = content.substring(command.keyword.length).trim();
            response = await command.handler(params);
            foundCommand = true;
            break;
          }
        }
        // If no command matched, try to interpret the question
        if (!foundCommand) {
          if (
            lowerCaseContent.includes("help") ||
            lowerCaseContent.includes("command")
          ) {
            response = await commands[0].handler("");
          } else if (
            lowerCaseContent.includes("all tasks") ||
            lowerCaseContent.includes("show tasks")
          ) {
            response = await commands[1].handler("");
          } else if (lowerCaseContent.includes("show status")) {
            response = await commands[2].handler(lowerCaseContent);
          } else if (
            lowerCaseContent.includes("todo") ||
            lowerCaseContent.includes("to do")
          ) {
            response = await commands[3].handler("");
          } else if (
            lowerCaseContent.includes("in progress") ||
            lowerCaseContent.includes("in-progress")
          ) {
            response = await commands[4].handler("");
          } else if (
            lowerCaseContent.includes("done") ||
            lowerCaseContent.includes("completed")
          ) {
            response = await commands[5].handler("");
          } else if (
            lowerCaseContent.includes("find") ||
            lowerCaseContent.includes("search")
          ) {
            const searchTerm = lowerCaseContent
              .replace(/find|search/g, "")
              .trim();
            response = await commands[6].handler(searchTerm);
          } else if (lowerCaseContent.includes("due today")) {
            response = await commands[7].handler("");
          } else if (lowerCaseContent.includes("due this week")) {
            response = await commands[8].handler("");
          } else if (lowerCaseContent.includes("high priority")) {
            response = await commands[9].handler("");
          } else if (
            lowerCaseContent.includes("summary") ||
            lowerCaseContent.includes("overview")
          ) {
            response = await commands[10].handler("");
          } else {
            // Generic response if no specific command matched
            response =
              "I'm not sure I understand. Try asking about your tasks, or type 'help' to see what I can do.";
          }
        }

        // Add bot response
        const botMessage: Message = {
          id: Date.now().toString(),
          content: response,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error processing message:", error);

        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          content:
            "I'm sorry, I encountered an error processing your request. Please try again.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [commands, tasks, searchTasks, getTasksByStatus]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      await processMessage(content);
      setInputValue("");
    },
    [processMessage]
  );

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isLoading,
    isChatOpen,
    toggleChat,
  };
};
