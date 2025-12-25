import { logger } from '@/ui/logger';
import { uninstall as uninstallMac } from './mac/uninstall';
import { uninstall as uninstallWin32 } from './win32/install';

export async function uninstall(): Promise<void> {
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    if (isWindows) {
        logger.info('Uninstalling HAPI CLI daemon for Windows...');
        await uninstallWin32();
    } else if (isMac) {
        if (process.getuid && process.getuid() !== 0) {
            throw new Error('Daemon uninstallation requires sudo privileges. Please run with sudo.');
        }
        logger.info('Uninstalling HAPI CLI daemon for macOS...');
        await uninstallMac();
    } else {
        throw new Error('Daemon uninstallation is currently only supported on Windows and macOS');
    }
}
