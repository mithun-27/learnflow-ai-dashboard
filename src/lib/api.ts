const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1";
console.log("DEBUG: API_URL is", API_URL);

export type TaskStatus = "PENDING" | "SUCCESS" | "FAILURE";

export interface TaskResponse {
  task_id: string;
  status: string;
}

export interface RoadmapUnit {
  title: string;
  lessons: string[];
}

export interface Roadmap {
  topic: string;
  units: RoadmapUnit[];
}

export interface Topic {
  id: number;
  title: string;
  created_at: string;
}

class ApiClient {
  private token: string | null = localStorage.getItem("token");

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  }

  // Auth
  async login(formData: FormData) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: formData, // OAuth2PasswordRequestForm expects form data
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(data: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Roadmap
  async generateRoadmap(topic: string): Promise<TaskResponse> {
    return this.request("/roadmap/generate-roadmap", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  }

  async getTopics(): Promise<Topic[]> {
    return this.request("/roadmap/");
  }

  async getRoadmap(topicId: number): Promise<Roadmap> {
    return this.request(`/roadmap/${topicId}`);
  }

  // Tasks
  async getTaskStatus(taskId: string): Promise<TaskResponse & { result?: any }> {
    return this.request(`/tasks/status/${taskId}`);
  }

  // Chat
  async sendMessage(topicId: number, message: string, lessonId?: number, history: any[] = []) {
    return this.request("/chat/", {
      method: "POST",
      body: JSON.stringify({
        topic_id: topicId,
        lesson_id: lessonId,
        user_message: message,
        history: history,
      }),
    });
  }

  // Lessons
  async getLesson(lessonId: number) {
    return this.request(`/lesson/${lessonId}`);
  }
  
  async generateLesson(lessonId: number): Promise<TaskResponse> {
    return this.request(`/lesson/generate-lesson/${lessonId}`, {
      method: "POST"
    });
  }
}

export const api = new ApiClient();
