import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs.js';
import * as strapiApi from './strapiApi.js';

vi.mock('./strapiApi', () => ({
    getServiceTitle: vi.fn(),
    getPortfolioTitle: vi.fn(),
    getArticleTitle: vi.fn(),
    getNewsTitle: vi.fn(),
}));

describe('getBreadcrumbs', () => {
    beforeAll(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        (console.error as any).mockRestore();
    });

    it('returns empty array for unknown root page', async () => {
        const result = await getBreadcrumbs('/unknown/path');
        expect(result).toEqual([]);
    });

    it('returns base breadcrumbs for contacts', async () => {
        const result = await getBreadcrumbs('/contacts');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Контакты', href: '/contacts', isCurrent: true },
        ]);
    });

    it('returns service breadcrumbs with slug', async () => {
        (strapiApi.getServiceTitle as any).mockResolvedValue('Service Title');
        const result = await getBreadcrumbs('/services/some-service');

        expect(strapiApi.getServiceTitle).toHaveBeenCalledWith('some-service');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Услуги', href: '/services' },
            { title: 'Service Title', isCurrent: true },
        ]);
    });

    it('returns service breadcrumbs without slug', async () => {
        const result = await getBreadcrumbs('/services');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Услуги', isCurrent: true },
        ]);
    });

    it('returns portfolio breadcrumbs with slug', async () => {
        (strapiApi.getPortfolioTitle as any).mockResolvedValue('Portfolio Item');
        const result = await getBreadcrumbs('/portfolio/item-1');

        expect(strapiApi.getPortfolioTitle).toHaveBeenCalledWith('item-1');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Портфолио', href: '/portfolio/category/all/1' },
            { title: 'Portfolio Item', isCurrent: true },
        ]);
    });

    it('returns article breadcrumbs with slug', async () => {
        (strapiApi.getArticleTitle as any).mockResolvedValue('Article Title');
        const result = await getBreadcrumbs('/articles/some-article');

        expect(strapiApi.getArticleTitle).toHaveBeenCalledWith('some-article');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Статьи', href: '/articles/page/1' },
            { title: 'Article Title', isCurrent: true },
        ]);
    });

    it('returns article breadcrumbs without slug', async () => {
        const result = await getBreadcrumbs('/articles/page/1');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Статьи', isCurrent: true },
        ]);
    });

    it('returns news breadcrumbs with slug', async () => {
        (strapiApi.getNewsTitle as any).mockResolvedValue('News Title');
        const result = await getBreadcrumbs('/news/some-news');

        expect(strapiApi.getNewsTitle).toHaveBeenCalledWith('some-news');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Новости', href: '/news/page/1' },
            { title: 'News Title', isCurrent: true },
        ]);
    });

    it('returns news breadcrumbs without slug', async () => {
        const result = await getBreadcrumbs('/news/page/1');
        expect(result).toEqual([
            { title: 'Главная', href: '/' },
            { title: 'Новости', isCurrent: true },
        ]);
    });

    it('handles error in getServiceTitle function gracefully', async () => {
        (strapiApi.getServiceTitle as any).mockRejectedValue(new Error('Failed fetch'));
        await expect(getBreadcrumbs('/services/fail')).rejects.toThrowError('Failed to get breadcrumbs');
    });

    it('handles error in getArticleTitle function gracefully', async () => {
        (strapiApi.getArticleTitle as any).mockRejectedValue(new Error('Failed fetch'));
        await expect(getBreadcrumbs('/articles/fail')).rejects.toThrowError('Failed to get breadcrumbs');
    });

    it('handles error in getPortfolioTitle function gracefully', async () => {
        (strapiApi.getPortfolioTitle as any).mockRejectedValue(new Error('Failed fetch'));
        await expect(getBreadcrumbs('/portfolio/fail')).rejects.toThrowError('Failed to get breadcrumbs');
    });

    it('handles error in getNewsTitle function gracefully', async () => {
        (strapiApi.getNewsTitle as any).mockRejectedValue(new Error('Failed fetch'));
        await expect(getBreadcrumbs('/news/fail')).rejects.toThrowError('Failed to get breadcrumbs');
    });
});
