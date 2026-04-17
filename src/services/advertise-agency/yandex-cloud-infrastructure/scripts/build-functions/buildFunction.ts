#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { execSync } from 'child_process';
import { BuildFunctionConfig } from './config';

interface PackageJson {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    [key: string]: unknown;
}

// Функция очистки директории
function cleanDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    console.log(`📦 Cleaning [${dirPath}]...`);
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        try {
            fs.rmSync(filePath, { recursive: true, force: true });
        } catch {
            console.log(`⚠️ Could not delete ${file}, skipping...`);
        }
    }
}

// Функция очистки всех директорий
function cleanAllDirectories(distDir: string, sharedDistDir: string, outputZip: string, name: string): void {
    console.log(`🚀 Building for Yandex Cloud Function [${name}]...\n`);

    [distDir, sharedDistDir].forEach((dirPath) => {
        cleanDirectory(dirPath);
    });

    if (fs.existsSync(outputZip)) {
        console.log(`📦 Deleting ${outputZip}...`);
        fs.rmSync(outputZip, { recursive: true, force: true });
    }
}

// Функция сборки shared проекта
async function buildSharedProject(sharedRoot: string): Promise<void> {
    console.log('🔨 Building shared project...');
    try {
        execSync('tsc --build --force', {
            cwd: sharedRoot,
            stdio: 'inherit',
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
        });

        console.log('✅ Successfully built shared/dist');
    } catch (err) {
        console.error('❌ Failed to build shared project');
        throw err;
    }
}

// Функция сборки функции
async function buildFunctionProject(projectRoot: string, name: string): Promise<void> {
    console.log(`\n🔨 Building ${name}...`);
    try {
        execSync('npm run build', {
            cwd: projectRoot,
            stdio: 'inherit',
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
        });
        console.log(`✅ Successfully built ${name}`);
    } catch (err) {
        console.error(`❌ Failed to build ${name}`);
        throw err;
    }
}

/**
 * Заменяет импорты aliasName на корректный относительный путь к fixingDirName
 * @param filePath - путь к JS файлу
 * @param distRoot - корневая директория сборки (dist)
 * @param fixingDirName - имя папки, в которую скопирован shared (например, 'shared')
 * @param aliasName - имя алиаса (например, '@shared')
 */
function fixImportsInFile(filePath: string, distRoot: string, fixingDirName: string, aliasName: string): void {
    let content = fs.readFileSync(filePath, 'utf8');

    // Вычисляем относительный путь от текущего файла до папки fixingDirName
    const fileDir = path.dirname(filePath);
    let relativePath = path.relative(fileDir, path.join(distRoot, fixingDirName));
    relativePath = relativePath.replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }

    const escaped = aliasName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
        { from: new RegExp(`require\\(["']${escaped}\\/([^"']+)["']\\)`, 'g'), to: `require("${relativePath}/$1")` },
        { from: new RegExp(`require\\(["']${escaped}["']\\)`, 'g'),            to: `require("${relativePath}")` },
        { from: new RegExp(`from ["']${escaped}\\/([^"']+)["']`, 'g'),         to: `from "${relativePath}/$1"` },
        { from: new RegExp(`from ["']${escaped}["']`, 'g'),                    to: `from "${relativePath}"` },
        { from: new RegExp(`import\\s*\\(["']${escaped}\\/([^"']+)["']\\)`, 'g'), to: `import("${relativePath}/$1")` },
        { from: new RegExp(`import\\s*\\(["']${escaped}["']\\)`, 'g'),         to: `import("${relativePath}")` },
    ];

    let modifiedFlag = false;
    for (const pattern of patterns) {
        const newContent = content.replace(pattern.from, pattern.to);
        if (newContent !== content) {
            modifiedFlag = true;
            content = newContent;
        }
    }

    if (modifiedFlag) {
        fs.writeFileSync(filePath, content);
        const relPath = path.relative(process.cwd(), filePath);
        console.log(`   Fixed: ${relPath} -> ${relativePath}`);
    }
}

/**
 * Рекурсивно обходит директорию и исправляет импорты во всех JS файлах
 * @param currentDir - текущая директория для обхода
 * @param distRoot - корневая директория сборки (dist)
 * @param fixingDirName - имя папки, куда скопирован shared
 * @param aliasName - имя алиаса импорта
 * @param ignoredAbsPaths - список абсолютных путей папок, которые не нужно обходить
 */
function fixImportsInDirectory(
    currentDir: string,
    distRoot: string,
    fixingDirName: string,
    aliasName: string,
    ignoredAbsPaths: string[]
): void {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
        const entryPath = path.join(currentDir, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
            if (!ignoredAbsPaths.includes(entryPath)) {
                fixImportsInDirectory(entryPath, distRoot, fixingDirName, aliasName, ignoredAbsPaths);
            }
        } else if (entry.endsWith('.js')) {
            fixImportsInFile(entryPath, distRoot, fixingDirName, aliasName);
        }
    }
}

// Функция копирования package.json
async function copyPackageJson(projectRoot: string, distDir: string): Promise<void> {
    console.log('📄 Copying package.json...');
    try {
        const packageJsonContent = fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8');
        const packageJson: PackageJson = JSON.parse(packageJsonContent);

        // Удаляем devDependencies и скрипты для production
        delete packageJson.devDependencies;
        delete packageJson.scripts;

        fs.writeFileSync(
            path.join(distDir, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );
        console.log('✅ package.json copied');
    } catch (err) {
        console.error('❌ Failed to copy package.json:', (err as Error).message);
        throw err;
    }
}

// Функция установки production зависимостей
async function installProductionDependencies(distDir: string): Promise<void> {
    console.log('📦 Installing production dependencies...');
    try {
        execSync('npm install --only=production', {
            cwd: distDir,
            stdio: 'inherit',
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
        });
        console.log('✅ Dependencies installed');
    } catch {
        console.log('⚠️ Warning: npm install issue');
        // Не критичная ошибка, продолжаем
    }
}

// Функция копирования shared в dist
async function copySharedToDist(sharedRoot: string, sharedDistDir: string, sharedTarget: string): Promise<void> {
    console.log(`\n📦 Copying shared to ${sharedTarget}...`);
    try {
        // Проверяем, существует ли shared/dist
        if (!fs.existsSync(sharedDistDir)) {
            console.log(`⚠️ ${sharedDistDir} does not exist`);
            console.log('Trying to use shared/src instead...');
            const sharedSrcDir = path.resolve(sharedRoot, 'src');
            if (fs.existsSync(sharedSrcDir)) {
                fs.mkdirSync(sharedTarget, { recursive: true });
                fs.cpSync(sharedSrcDir, sharedTarget, { recursive: true });
                console.log('✅ Shared src copied successfully');
                return;
            }
            throw new Error('Neither dist nor src found in shared');
        }

        // Проверяем, что shared/dist не пуст
        const distFiles = fs.readdirSync(sharedDistDir);
        if (distFiles.length === 0) {
            console.log('⚠️ shared/dist is empty, using shared/src instead...');
            const sharedSrcDir = path.resolve(sharedRoot, 'src');
            fs.mkdirSync(sharedTarget, { recursive: true });
            fs.cpSync(sharedSrcDir, sharedTarget, { recursive: true });
            console.log('✅ Shared src copied successfully');
            return;
        }

        fs.mkdirSync(sharedTarget, { recursive: true });
        fs.cpSync(sharedDistDir, sharedTarget, { recursive: true });
        console.log('✅ Shared copied successfully');
    } catch (err) {
        console.error('❌ Failed to copy shared:', (err as Error).message);
        throw err;
    }
}

// Функция создания ZIP через archiver
async function createZipWithArchiver(distDir: string, outputZip: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('\n🗜️ Creating index.zip with archiver...');

        const output = fs.createWriteStream(outputZip);
        const archive = (archiver as any).default('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`✅ Created index.zip (${archive.pointer()} bytes)`);
            resolve();
        });

        archive.on('error', (err: Error) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(distDir, false);
        archive.finalize();
    });
}

// Функция создания ZIP через PowerShell (fallback для Windows)
async function createZipWithPowerShell(distDir: string, outputZip: string): Promise<void> {
    console.log('\n🗜️ Creating index.zip with PowerShell...');

    return new Promise((resolve, reject) => {
        try {
            execSync(`powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${outputZip}' -Force"`, {
                stdio: 'inherit',
                shell: 'cmd.exe'
            });
            console.log('✅ Created index.zip using PowerShell');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

// Функция создания ZIP (основная)
async function createZip(distDir: string, outputZip: string): Promise<void> {
    try {
        await createZipWithArchiver(distDir, outputZip);
    } catch (err) {
        console.log(`⚠️ archiver failed: [${err}], trying PowerShell...`);
        await createZipWithPowerShell(distDir, outputZip);
    }
}

// Функция копирования ZIP в dist
async function copyZipToDist(outputZip: string, distZip: string): Promise<void> {
    console.log('\n📦 Copying index.zip to dist...');

    if (!fs.existsSync(outputZip)) {
        throw new Error(`index.zip not found at ${outputZip}`);
    }

    const zipStats = fs.statSync(outputZip);
    if (zipStats.size === 0) {
        throw new Error('index.zip is empty');
    }

    console.log(`   Source: ${outputZip} (${zipStats.size} bytes)`);
    console.log(`   Target: ${distZip}`);

    fs.copyFileSync(outputZip, distZip);

    if (fs.existsSync(distZip)) {
        const targetStats = fs.statSync(distZip);
        console.log(`   ✅ Copied successfully (${targetStats.size} bytes)`);

        // Удаляем оригинал из корня
        fs.rmSync(outputZip);
        console.log(`   ✅ Deleted index.zip from root`);
    } else {
        throw new Error('Copy failed - target file not found');
    }
}

// Функция завершения сборки
function finalizeBuild(distZip: string): void {
    console.log('\n✅ Build complete! index.zip is ready for Yandex Cloud Function.');
    console.log(`📍 Location: ${distZip}`);
    console.log(`📦 Size: ${(fs.statSync(distZip).size / 1024 / 1024).toFixed(2)} MB`);
}

// Основная функция сборки
export async function buildFunction(config: BuildFunctionConfig): Promise<void> {
    const distDirName      = config.distDirName ?? 'dist';
    const aliases          = config.aliases ?? [{ aliasName: '@shared', targetDirName: 'src/shared' }];
    const sharedAlias      = aliases.find(a => a.aliasName === '@shared');
    const sharedTargetName = sharedAlias?.targetDirName ?? 'src/shared';

    const distDir       = path.join(config.projectRoot, distDirName);
    const sharedDistDir = path.join(config.sharedRoot, distDirName);
    const sharedTarget  = path.join(distDir, sharedTargetName);
    const outputZip     = path.join(config.projectRoot, 'index.zip');
    const distZip       = path.join(distDir, 'index.zip');

    // Resolve ignoredDirs (relative to distDir) into absolute paths for precise matching
    const ignoredAbsPaths = config.ignoredDirs.map(d => path.join(distDir, d));

    try {
        cleanAllDirectories(distDir, sharedDistDir, outputZip, config.name);
        await buildSharedProject(config.sharedRoot);
        await buildFunctionProject(config.projectRoot, config.name);
        for (const alias of aliases) {
            fixImportsInDirectory(distDir, distDir, alias.targetDirName, alias.aliasName, ignoredAbsPaths);
        }
        await copyPackageJson(config.projectRoot, distDir);
        await installProductionDependencies(distDir);
        await copySharedToDist(config.sharedRoot, sharedDistDir, sharedTarget);
        await createZip(distDir, outputZip);
        await copyZipToDist(outputZip, distZip);
        finalizeBuild(distZip);
    } catch (err) {
        console.error('\n❌ Build failed:', (err as Error).message);
        process.exit(1);
    }
}

export async function buildFunctions(configs: BuildFunctionConfig[]): Promise<void> {
    for (const config of configs) {
        await buildFunction(config);
    }
}
