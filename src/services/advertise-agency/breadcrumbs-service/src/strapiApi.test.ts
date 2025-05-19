import { describe, it, expect, vi, beforeEach } from 'vitest';
import {getArticleTitle, getNewsTitle, getPortfolioTitle, getServiceTitle} from './strapiApi';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockResponse = (data: any, ok = true) =>
    Promise.resolve({
        ok,
        status: ok ? 200 : 500,
        statusText: ok ? 'OK' : 'Internal Server Error',
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
    });

describe("getArticleTitle", () => {
   beforeEach(() => {
       vi.clearAllMocks();
       process.env.STRAPI_API = "http://localhost:1337/api";
   });

   it("returns article's title, if it was found", async () => {
      mockFetch.mockResolvedValueOnce(
          mockResponse({
              data: [
                  {
                      id: 1,
                      title: "Test article",
                      slug: "test-article"
                  }
              ]
          })
      );

      const title = await getArticleTitle("test-article");
      expect(title).toBe("Test article");
   });

   it("returns null if it was not found", async () => {
      mockFetch.mockResolvedValueOnce(
          mockResponse({
              data: []
          })
      );

      const title = await getArticleTitle("not-found");
      expect(title).toBeNull();
   });

   it("catch network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(getArticleTitle("error")).rejects.toThrowError("Network error");
   });
});

describe("getServiceTitle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.STRAPI_API = "http://localhost:1337";
    });

    it("returns service's title, if it was found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: [
                    {
                        id: 1,
                        title: "Test article",
                        slug: "test-article"
                    }
                ]
            })
        );

        const title = await getServiceTitle("test-article");
        expect(title).toBe("Test article");
    });

    it("returns null if it was not found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: []
            })
        );

        const title = await getServiceTitle("not-found");
        expect(title).toBeNull();
    });

    it("catch network error", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));
        await expect(getServiceTitle("error")).rejects.toThrowError("Network error");
    });
});

describe("getPortfolioTitle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.STRAPI_API = "http://localhost:1337";
    });

    it("returns portfolio's title, if it was found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: [
                    {
                        id: 1,
                        title: "Test article",
                        slug: "test-article"
                    }
                ]
            })
        );

        const title = await getPortfolioTitle("test-article");
        expect(title).toBe("Test article");
    });

    it("returns null if it was not found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: []
            })
        );

        const title = await getPortfolioTitle("not-found");
        expect(title).toBeNull();
    });

    it("catch network error", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));
        await expect(getPortfolioTitle("error")).rejects.toThrowError("Network error");
    });
});

describe("getNewsTitle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.STRAPI_API = "http://localhost:1337";
    });

    it("returns news's title, if it was found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: [
                    {
                        id: 1,
                        title: "Test article",
                        slug: "test-article"
                    }
                ]
            })
        );

        const title = await getNewsTitle("test-article");
        expect(title).toBe("Test article");
    });

    it("returns null if it was not found", async () => {
        mockFetch.mockResolvedValueOnce(
            mockResponse({
                data: []
            })
        );

        const title = await getNewsTitle("not-found");
        expect(title).toBeNull();
    });

    it("catch network error", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));
        await expect(getNewsTitle("error")).rejects.toThrowError("Network error");
    });
});