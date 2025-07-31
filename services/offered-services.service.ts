import httpService from "./http.service";

export interface OfferedService {
  id: number;
  category: string;
  name: string;
  price: string;
  status: "offered" | "not_offered";
  created_at: string;
  updated_at: string;
}

export interface CreateOfferedServicePayload {
  category: string;
  name: string;
  price: number;
  status: "offered" | "not_offered";
}

export interface UpdateOfferedServicePayload {
  category: string;
  name: string;
  price: number;
  status: "offered" | "not_offered";
}

class OfferedServicesService {
  private readonly endpoint = "/services";

  async getAll(): Promise<OfferedService[]> {
    try {
      const response = await httpService.get(this.endpoint);
      console.log("API response:", response);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("API response is not an array:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching offered services:", error);
      return [];
    }
  }

  async getById(id: number): Promise<OfferedService> {
    try {
      const response = await httpService.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching offered service with id ${id}:`, error);
      throw error;
    }
  }

  async create(payload: CreateOfferedServicePayload): Promise<OfferedService> {
    try {
      const response = await httpService.post(this.endpoint, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating offered service:", error);
      throw error;
    }
  }

  async update(
    id: number,
    payload: UpdateOfferedServicePayload
  ): Promise<OfferedService> {
    try {
      const response = await httpService.put(`${this.endpoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating offered service with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await httpService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting offered service with id ${id}:`, error);
      throw error;
    }
  }
}

export default new OfferedServicesService();
