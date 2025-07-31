import httpService from "./http.service";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class AuthService {
  async signInAndRedirect(
    credentials: SignInCredentials
  ): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        "/auth/signin",
        credentials
      );

      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/backoffice-dashboard/app";

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await httpService.post("/auth/signout");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/signin";
    }
  }

  async getCurrentUser(): Promise<AuthResponse["user"] | null> {
    try {
      const response = await httpService.get<AuthResponse["user"]>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getStoredUser(): AuthResponse["user"] | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
