import { homedir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Sanitize a path string to create a valid project name.
 * Converts path separators and special characters to hyphens.
 *
 * @param path - The path to sanitize
 * @returns A sanitized project name with special characters replaced by hyphens
 *
 * @example
 * sanitizeProjectName('/Users/steve/projects/my-app') // '-Users-steve-projects-my-app'
 * sanitizeProjectName('C:\\Users\\test') // 'C-Users-test'
 * sanitizeProjectName('/var/www/my.site.com') // '-var-www-my-site-com'
 */
export function sanitizeProjectName(path: string): string {
    // Normalize path separators (Windows: \ -> /)
    const normalized = path.replace(/\\/g, '/');
    // Remove colons from drive letters (C: -> C) while keeping the letter
    // The regex matches : followed by / or \
    const withoutDriveColon = normalized.replace(/:(?=[\\/])/g, '');
    // Replace special characters with hyphens
    return withoutDriveColon.replace(/[\/\.:_]/g, '-');
}

/**
 * Get the project path for a given working directory.
 * Creates a unique project identifier based on the path.
 *
 * @param workingDirectory - The working directory to create a project path for
 * @returns The full project path including .claude/projects/
 *
 * @example
 * getProjectPath('/Users/steve/projects/my-app')
 * // Returns something like '/home/user/.claude/projects/-Users-steve-projects-my-app'
 */
export function getProjectPath(workingDirectory: string) {
    const resolvedPath = resolve(workingDirectory);
    const projectId = sanitizeProjectName(resolvedPath);

    const claudeConfigDir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
    return join(claudeConfigDir, 'projects', projectId);
}
