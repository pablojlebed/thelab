export type Task = {
    id: string;
    title: string;
    owner: string;      // Renamed from superhero
    description: string; // Renamed from mission
    priority: 'Low' | 'Medium' | 'High' | 'Critical'; // Standardized
    status: string;     // Column ID
    board_id: string;
    category?: 'task' | 'capa' | 'ci'; // New field for type
    due_date?: string;  // ISO date string for deadline
    created_at?: string;
};

export type Column = {
    id: string;
    title: string;
    items: Task[];
};

export type Board = {
    id: string;
    name: string;
    category?: 'task' | 'capa' | 'ci';
    created_at?: string;
};

export type Comment = {
    id: string;
    task_id: string;
    content: string;
    created_at: string;
};
