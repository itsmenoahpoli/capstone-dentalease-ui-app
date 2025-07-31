import httpService from "./http.service";

export interface Appointment {
  id: number;
  patient_name: string;
  patient_email: string;
  patient_contact: string;
  purpose: string;
  remarks: string;
  schedule_time: string;
  schedule_date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_email: string;
  patient_contact: string;
  purpose: string;
  remarks?: string;
  schedule_time: string;
  schedule_date: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: number;
}

class AppointmentsService {
  private baseUrl = "/appointments";

  async getAllAppointments(): Promise<Appointment[]> {
    const response = await httpService.get<Appointment[]>(this.baseUrl);
    return response.data;
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const response = await httpService.get<Appointment>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await httpService.post<Appointment>(this.baseUrl, data);
    return response.data;
  }

  async updateAppointment(data: UpdateAppointmentData): Promise<Appointment> {
    const { id, ...updateData } = data;
    const response = await httpService.put<Appointment>(
      `${this.baseUrl}/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/${id}`);
  }

  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Appointment[]> {
    const response = await httpService.get<Appointment[]>(
      `${this.baseUrl}/date-range`,
      {
        params: { start_date: startDate, end_date: endDate },
      }
    );
    return response.data;
  }

  async updateAppointmentStatus(
    id: number,
    status: Appointment["status"]
  ): Promise<Appointment> {
    const response = await httpService.patch<Appointment>(
      `${this.baseUrl}/${id}/status`,
      { status }
    );
    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
