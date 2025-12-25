import { logger } from '@/ui/logger';
import { install as installMac } from './mac/install';
import { install as installWin32 } from './win32/install';

export async function install(): Promise<void> {
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    if (isWindows) {
        // Windows: use scheduled task
        logger.info('Installing HAPI CLI daemon for Windows...');
        await installWin32();
    } else if (isMac) {
        // macOS: use launchd
        if (process.getuid && process.getuid() !== 0) {
            throw new Error('Daemon installation requires sudo privileges. Please run with sudo.');
        }
        logger.info('Installing HAPI CLI daemon for macOS...');
        await installMac();
    } else {
        // Linux: not yet implemented
        throw new Error('Daemon installation is currently only supported on Windows and macOS');
    }
}
