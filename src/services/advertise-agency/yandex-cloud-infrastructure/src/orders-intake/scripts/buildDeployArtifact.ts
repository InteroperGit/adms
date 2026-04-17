#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { execSync } from 'child_process';

// Константы
const ROOT_DIR = path.resolve(__dirname, '..');
const SHARED_DIR = path.resolve(ROOT_DIR, '../shared');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const SHARED_DIST_DIR = path.resolve(SHARED_DIR, 'dist');
const SHARED_TARGET = path.resolve(DIST_DIR, 'shared');
const OUTPUT_ZIP_PATH = path.join(ROOT_DIR, 'index.zip');
const DIST_ZIP_PATH = path.join(DIST_DIR, 'index.zip');
const IGNORED_DIRS = ['node_modules', 'shared'];
const FIXING_DIR_NAMES = ["shared"];

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

    console.log(`📦 Cleaning ${dirPath}...`);
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
function cleanAllDirectories(): void {
    console.log('🚀 Building for Yandex Cloud Function...\n');

    [DIST_DIR, SHARED_DIST_DIR].forEach((dirPath) => {
        cleanDirectory(dirPath);
    });

    if (fs.existsSync(OUTPUT_ZIP_PATH)) {
        console.log(`📦 Deleting ${OUTPUT_ZIP_PATH}...`);
        fs.rmSync(OUTPUT_ZIP_PATH, { recursive: true, force: true });
    }
}

// Функция сборки shared проекта
async function buildSharedProject(): Promise<void> {
    console.log('🔨 Building shared project...');
    try {
        execSync('tsc --build --force', {
            cwd: SHARED_DIR,
            stdio: 'inherit',
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
        });

        console.log('✅ Successfully built shared/dist');
    } catch (err) {
        console.error('❌ Failed to build shared project');
        throw err;
    }
}

// Функция сборки orders-intake
async function buildOrdersIntake(): Promise<void> {
    console.log('\n🔨 Building orders-intake...');
    try {
        execSync('npm run build', {
            cwd: ROOT_DIR,
            stdio: 'inherit',
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
        });
        console.log('✅ Successfully built orders-intake');
    } catch (err) {
        console.error('❌ Failed to build orders-intake');
        throw err;
    }
}

/**
 * Заменяет импорты @shared на корректный относительный путь к fixingDirName
 * @param filePath - путь к JS файлу
 * @param distRoot - корневая директория сборки (dist)
 * @param fixingDirName - имя папки, в которую скопирован shared (например, 'shared')
 */
function fixImportsInFile(filePath: string, distRoot: string, fixingDirName: string): void {
    let content = fs.readFileSync(filePath, 'utf8');

    // Вычисляем относительный путь от текущего файла до папки fixingDirName
    const fileDir = path.dirname(filePath);
    let relativePath = path.relative(fileDir, path.join(distRoot, fixingDirName));
    relativePath = relativePath.replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }

    const patterns = [
        { from: /require\(["']@shared\/([^"']+)["']\)/g, to: `require("${relativePath}/$1")` },
        { from: /require\(["']@shared["']\)/g, to: `require("${relativePath}")` },
        { from: /from ["']@shared\/([^"']+)["']/g, to: `from "${relativePath}/$1"` },
        { from: /from ["']@shared["']/g, to: `from "${relativePath}"` },
        { from: /import\s*\(["']@shared\/([^"']+)["']\)/g, to: `import("${relativePath}/$1")` },
        { from: /import\s*\(["']@shared["']\)/g, to: `import("${relativePath}")` }
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
 * @param ignoredDirs - список имён папок, которые не нужно обходить
 */
function fixImportsInDirectory(
    currentDir: string,
    distRoot: string,
    fixingDirName: string,
    ignoredDirs: string[] = IGNORED_DIRS
): void {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
        const entryPath = path.join(currentDir, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
            if (!ignoredDirs.includes(entry)) {
                fixImportsInDirectory(entryPath, distRoot, fixingDirName, ignoredDirs);
            }
        } else if (entry.endsWith('.js')) {
            fixImportsInFile(entryPath, distRoot, fixingDirName);
        }
    }
}

// Функция копирования package.json
async function copyPackageJson(): Promise<void> {
    console.log('📄 Copying package.json...');
    try {
        const packageJsonContent = fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8');
        const packageJson: PackageJson = JSON.parse(packageJsonContent);

        // Удаляем devDependencies и скрипты для production
        delete packageJson.devDependencies;
        delete packageJson.scripts;

        fs.writeFileSync(
            path.join(DIST_DIR, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );
        console.log('✅ package.json copied');
    } catch (err) {
        console.error('❌ Failed to copy package.json:', (err as Error).message);
        throw err;
    }
}

// Функция установки production зависимостей
async function installProductionDependencies(): Promise<void> {
    console.log('📦 Installing production dependencies...');
    try {
        execSync('npm install --only=production', {
            cwd: DIST_DIR,
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
async function copySharedToDist(): Promise<void> {
    console.log(`\n📦 Copying shared to ${SHARED_DIST_DIR}...`);
    try {
        // Проверяем, существует ли shared/dist
        if (!fs.existsSync(SHARED_DIST_DIR)) {
            console.log(`⚠️ ${SHARED_DIST_DIR} does not exist`);
            console.log('Trying to use shared/src instead...');
            const SHARED_SRC_DIR = path.resolve(SHARED_DIR, 'src');
            if (fs.existsSync(SHARED_SRC_DIR)) {
                fs.mkdirSync(SHARED_TARGET, { recursive: true });
                fs.cpSync(SHARED_SRC_DIR, SHARED_TARGET, { recursive: true });
                console.log('✅ Shared src copied successfully');
                return;
            }
            throw new Error('Neither dist nor src found in shared');
        }

        // Проверяем, что shared/dist не пуст
        const distFiles = fs.readdirSync(SHARED_DIST_DIR);
        if (distFiles.length === 0) {
            console.log('⚠️ shared/dist is empty, using shared/src instead...');
            const SHARED_SRC_DIR = path.resolve(SHARED_DIR, 'src');
            fs.mkdirSync(SHARED_TARGET, { recursive: true });
            fs.cpSync(SHARED_SRC_DIR, SHARED_TARGET, { recursive: true });
            console.log('✅ Shared src copied successfully');
            return;
        }

        fs.mkdirSync(SHARED_TARGET, { recursive: true });
        fs.cpSync(SHARED_DIST_DIR, SHARED_TARGET, { recursive: true });
        console.log('✅ Shared copied successfully');
    } catch (err) {
        console.error('❌ Failed to copy shared:', (err as Error).message);
        throw err;
    }
}

// Функция создания ZIP через archiver
async function createZipWithArchiver(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('\n🗜️ Creating index.zip with archiver...');

        const output = fs.createWriteStream(OUTPUT_ZIP_PATH);
        // Используем archiver.default вместо archiver
        const archive = (archiver as any).default('zip', { zlib: { level: 9 } });
        // Или: const archive = archiver.default('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`✅ Created index.zip (${archive.pointer()} bytes)`);
            resolve();
        });

        archive.on('error', (err: Error) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(DIST_DIR, false);
        archive.finalize();
    });
}

// Функция создания ZIP через PowerShell (fallback для Windows)
async function createZipWithPowerShell(): Promise<void> {
    console.log('\n🗜️ Creating index.zip with PowerShell...');

    return new Promise((resolve, reject) => {
        try {
            execSync(`powershell -Command "Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${OUTPUT_ZIP_PATH}' -Force"`, {
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
async function createZip(): Promise<void> {
    try {
        await createZipWithArchiver();
    } catch(err) {
        console.log(`⚠️ archiver failed: [${err}], trying PowerShell...`);
        await createZipWithPowerShell();
    }
}

// Функция копирования ZIP в dist
async function copyZipToDist(): Promise<void> {
    console.log('\n📦 Copying index.zip to dist...');

    if (!fs.existsSync(OUTPUT_ZIP_PATH)) {
        throw new Error(`index.zip not found at ${OUTPUT_ZIP_PATH}`);
    }

    const zipStats = fs.statSync(OUTPUT_ZIP_PATH);
    if (zipStats.size === 0) {
        throw new Error('index.zip is empty');
    }

    console.log(`   Source: ${OUTPUT_ZIP_PATH} (${zipStats.size} bytes)`);
    console.log(`   Target: ${DIST_ZIP_PATH}`);

    fs.copyFileSync(OUTPUT_ZIP_PATH, DIST_ZIP_PATH);

    if (fs.existsSync(DIST_ZIP_PATH)) {
        const targetStats = fs.statSync(DIST_ZIP_PATH);
        console.log(`   ✅ Copied successfully (${targetStats.size} bytes)`);

        // Удаляем оригинал из корня
        fs.rmSync(OUTPUT_ZIP_PATH);
        console.log(`   ✅ Deleted index.zip from root`);
    } else {
        throw new Error('Copy failed - target file not found');
    }
}

// Функция завершения сборки
function finalizeBuild(): void {
    console.log('\n✅ Build complete! index.zip is ready for Yandex Cloud Function.');
    console.log(`📍 Location: ${DIST_ZIP_PATH}`);
    console.log(`📦 Size: ${(fs.statSync(DIST_ZIP_PATH).size / 1024 / 1024).toFixed(2)} MB`);
}

// Основная функция сборки
async function build(): Promise<void> {
    try {
        cleanAllDirectories();
        await buildSharedProject();
        await buildOrdersIntake();
        for (const fixingDir of FIXING_DIR_NAMES) {
            fixImportsInDirectory(DIST_DIR, DIST_DIR, fixingDir)
        }
        await copyPackageJson();
        await installProductionDependencies();
        await copySharedToDist();
        await createZip();
        await copyZipToDist();
        finalizeBuild();
    } catch (err) {
        console.error('\n❌ Build failed:', (err as Error).message);
        process.exit(1);
    }
}

// Запуск сборки
build();