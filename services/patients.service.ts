import httpService from "./http.service";

export interface Patient {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  citizenship: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CreatePatientData {
  name: string;
  email: string;
  contact: string;
  address: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  citizenship: string;
  status?: "active" | "inactive";
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: number;
}

class PatientsService {
  private baseUrl = "/patients";

  async getAllPatients(): Promise<Patient[]> {
    const response = await httpService.get<Patient[]>(this.baseUrl);
    return response.data;
  }

  async getPatientById(id: number): Promise<Patient> {
    const response = await httpService.get<Patient>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createPatient(data: CreatePatientData): Promise<Patient> {
    const response = await httpService.post<Patient>(this.baseUrl, data);
    return response.data;
  }

  async updatePatient(data: UpdatePatientData): Promise<Patient> {
    const { id, ...updateData } = data;
    const response = await httpService.put<Patient>(
      `${this.baseUrl}/${id}`,
      updateData
    );
    return response.data;
  }

  async deletePatient(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/${id}`);
  }

  async updatePatientStatus(
    id: number,
    status: Patient["status"]
  ): Promise<Patient> {
    const response = await httpService.patch<Patient>(
      `${this.baseUrl}/${id}/status`,
      { status }
    );
    return response.data;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const response = await httpService.get<Patient[]>(
      `${this.baseUrl}/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  }
}

export const patientsService = new PatientsService();
