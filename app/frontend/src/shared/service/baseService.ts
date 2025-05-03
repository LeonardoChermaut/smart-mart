export abstract class BaseService {
  protected readonly BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://smart-mart-backend.onrender.com/api/v1";

  protected readonly headers = {
    "Content-Type": "application/json",
  };

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP Error ${response.status}: ${
          errorData?.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
