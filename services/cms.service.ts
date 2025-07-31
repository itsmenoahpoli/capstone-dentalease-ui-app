import httpService from "./http.service";

export interface CMSContent {
  id: number;
  category: string;
  category_display: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCMSData {
  category: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  is_active?: boolean;
}

export interface UpdateCMSData extends Partial<CreateCMSData> {
  id: number;
}

class CMSService {
  private baseUrl = "/content";

  async getAllCMSContent(): Promise<CMSContent[]> {
    const response = await httpService.get<CMSContent[]>(this.baseUrl);
    return response.data;
  }

  async getCMSContentByCategory(
    category: string
  ): Promise<CMSContent | CMSContent[]> {
    const response = await httpService.get<CMSContent | CMSContent[]>(
      `${this.baseUrl}/category/${category}`
    );
    return response.data;
  }

  async getCMSContentById(id: number): Promise<CMSContent> {
    const response = await httpService.get<CMSContent>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCMSContent(data: CreateCMSData): Promise<CMSContent> {
    const response = await httpService.post<CMSContent>(this.baseUrl, data);
    return response.data;
  }

  async updateCMSContent(data: UpdateCMSData): Promise<CMSContent> {
    const { id, ...updateData } = data;
    const response = await httpService.put<CMSContent>(
      `${this.baseUrl}/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteCMSContent(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/${id}`);
  }

  async updateCMSContentStatus(
    id: number,
    is_active: boolean
  ): Promise<CMSContent> {
    const response = await httpService.patch<CMSContent>(
      `${this.baseUrl}/${id}/status`,
      { is_active }
    );
    return response.data;
  }

  async searchCMSContent(
    query: string,
    category?: string
  ): Promise<CMSContent[]> {
    const params: any = { q: query };
    if (category) {
      params.category = category;
    }

    const response = await httpService.get<CMSContent[]>(
      `${this.baseUrl}/search`,
      { params }
    );
    return response.data;
  }
}

export const cmsService = new CMSService();
