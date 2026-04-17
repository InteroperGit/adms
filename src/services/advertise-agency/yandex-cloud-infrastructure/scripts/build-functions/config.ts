import * as path from 'path';

export interface AliasFixConfig {
    aliasName: string;       // имя алиаса, например '@shared', '@src', '@data'
    targetDirName: string;   // путь относительно distDir, например 'src/shared', 'src', 'data'
}

export interface BuildFunctionConfig {
    name: string;                 // имя функции (для логов)
    projectRoot: string;          // путь к корню функции (где лежат src, package.json)
    sharedRoot: string;           // путь к корню shared проекта
    distDirName?: string;         // имя выходной папки (по умолчанию 'dist')
    aliases?: AliasFixConfig[];   // алиасы для замены импортов (по умолчанию только @shared)
    ignoredDirs: string[];        // папки для исключения при замене импортов (пути относительно distDir)
}

export const buildFunctionsConfig: BuildFunctionConfig[] = [
    {
        name: 'orders-intake',
        projectRoot: path.resolve(__dirname, '../../src/orders-intake'),
        sharedRoot: path.resolve(__dirname, '../../src/shared'),
        distDirName: 'dist',
        aliases: [
            { aliasName: '@shared', targetDirName: 'src/shared' },
        ],
        ignoredDirs: ['node_modules', 'src/shared'],
    },
    {
        name: 'dispatch-message-queue',
        projectRoot: path.resolve(__dirname, '../../src/dispatch-message-queue'),
        sharedRoot: path.resolve(__dirname, '../../src/shared'),
        distDirName: 'dist',
        aliases: [
            { aliasName: '@shared', targetDirName: 'src/shared' },
            { aliasName: '@src',    targetDirName: 'src' },
            { aliasName: '@data',   targetDirName: 'data/config' },
        ],
        ignoredDirs: ['node_modules', 'src/shared', 'data'],
    },
];
