export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        if (!baseUrl) throw new Error("HttpClient: baseUrl is required");
        this.baseUrl = baseUrl;
    }

    async get<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, { method: 'GET', ...options });
    }

    async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            },
            ...options,
        });
    }

    private async request<T>(url: string, options: RequestInit): Promise<T> {
        const fullUrl = `${this.baseUrl}${url}`;
        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error(`[HttpClient] Error ${response.status} on ${fullUrl}`, text);
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return await response.json() as Promise<T>;
    }
}
