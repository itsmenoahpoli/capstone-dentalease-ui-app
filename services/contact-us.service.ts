import httpService from "./http.service";

export interface ContactUsEntry {
  id: number;
  entry_id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactUsEntryData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status?: "new" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
}

export interface UpdateContactUsEntryData
  extends Partial<CreateContactUsEntryData> {
  id: number;
}

class ContactUsService {
  private baseUrl = "/contact-us";

  async getAllEntries(): Promise<ContactUsEntry[]> {
    const response = await httpService.get<ContactUsEntry[]>(this.baseUrl);
    return response.data;
  }

  async getEntryById(id: number): Promise<ContactUsEntry> {
    const response = await httpService.get<ContactUsEntry>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createEntry(data: CreateContactUsEntryData): Promise<ContactUsEntry> {
    const response = await httpService.post<ContactUsEntry>(this.baseUrl, data);
    return response.data;
  }

  async updateEntry(data: UpdateContactUsEntryData): Promise<ContactUsEntry> {
    const { id, ...updateData } = data;
    const response = await httpService.put<ContactUsEntry>(
      `${this.baseUrl}/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteEntry(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/${id}`);
  }

  async updateEntryStatus(
    id: number,
    status: ContactUsEntry["status"]
  ): Promise<ContactUsEntry> {
    const response = await httpService.patch<ContactUsEntry>(
      `${this.baseUrl}/${id}/status`,
      { status }
    );
    return response.data;
  }

  async updateEntryPriority(
    id: number,
    priority: ContactUsEntry["priority"]
  ): Promise<ContactUsEntry> {
    const response = await httpService.patch<ContactUsEntry>(
      `${this.baseUrl}/${id}/priority`,
      { priority }
    );
    return response.data;
  }

  async assignEntry(id: number, assigned_to: string): Promise<ContactUsEntry> {
    const response = await httpService.patch<ContactUsEntry>(
      `${this.baseUrl}/${id}/assign`,
      { assigned_to }
    );
    return response.data;
  }

  async searchEntries(query: string): Promise<ContactUsEntry[]> {
    const response = await httpService.get<ContactUsEntry[]>(
      `${this.baseUrl}/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  async getEntriesByStatus(
    status: ContactUsEntry["status"]
  ): Promise<ContactUsEntry[]> {
    const response = await httpService.get<ContactUsEntry[]>(
      `${this.baseUrl}/status/${status}`
    );
    return response.data;
  }

  async getEntriesByPriority(
    priority: ContactUsEntry["priority"]
  ): Promise<ContactUsEntry[]> {
    const response = await httpService.get<ContactUsEntry[]>(
      `${this.baseUrl}/priority/${priority}`
    );
    return response.data;
  }
}

export const contactUsService = new ContactUsService();
