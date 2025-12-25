import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getProjectPath, sanitizeProjectName } from './path';

// Store original env
const originalEnv = process.env;

describe('sanitizeProjectName', () => {
    it('should replace forward slashes with hyphens', () => {
        expect(sanitizeProjectName('/Users/steve/projects/my-app')).toBe('-Users-steve-projects-my-app');
    });

    it('should replace backslashes with hyphens', () => {
        expect(sanitizeProjectName('\\Users\\steve\\projects\\my-app')).toBe('-Users-steve-projects-my-app');
    });

    it('should replace dots with hyphens', () => {
        expect(sanitizeProjectName('/Users/steve/projects/app.test.js')).toBe('-Users-steve-projects-app-test-js');
    });

    it('should replace underscores with hyphens', () => {
        expect(sanitizeProjectName('/data/github/hapi__worktrees/ime')).toBe('-data-github-hapi--worktrees-ime');
    });

    it('should handle paths with both slashes and dots', () => {
        expect(sanitizeProjectName('/var/www/my.site.com/public')).toBe('-var-www-my-site-com-public');
    });

    it('should handle Windows drive letters (C:)', () => {
        expect(sanitizeProjectName('C:\\Users\\test')).toBe('C-Users-test');
        expect(sanitizeProjectName('C:/Users/test')).toBe('C-Users-test');
    });

    it('should handle mixed path separators', () => {
        expect(sanitizeProjectName('C:\\Users/steve\\projects/my-app')).toBe('C-Users-steve-projects-my-app');
    });

    it('should handle empty string', () => {
        expect(sanitizeProjectName('')).toBe('');
    });

    it('should handle root path', () => {
        expect(sanitizeProjectName('/')).toBe('-');
    });

    it('should handle consecutive special characters', () => {
        expect(sanitizeProjectName('/a//b')).toBe('-a--b'); // Two slashes -> two hyphens
        expect(sanitizeProjectName('/a..b')).toBe('-a--b'); // Two dots -> two hyphens
    });
});

describe('getProjectPath', () => {
    beforeEach(() => {
        // Reset process.env to a clean state
        process.env = { ...originalEnv };
        delete process.env.CLAUDE_CONFIG_DIR;
    });

    afterEach(() => {
        // Restore original env
        process.env = originalEnv;
    });

    it('should return a path ending with projects directory', () => {
        const result = getProjectPath('/test/project');
        expect(result).toContain('projects');
    });

    it('should include the sanitized project name', () => {
        const result = getProjectPath('/Users/steve/projects/my-app');
        expect(result).toContain('-Users-steve-projects-my-app');
    });

    it('should contain .claude directory', () => {
        const result = getProjectPath('/test/project');
        expect(result).toContain('.claude');
    });

    it('should use CLAUDE_CONFIG_DIR when set', () => {
        process.env.CLAUDE_CONFIG_DIR = '/custom/claude/config';
        const result = getProjectPath('/test/project');
        expect(result).toContain('custom');
        expect(result).toContain('claude');
    });

    it('should fallback to default when CLAUDE_CONFIG_DIR is empty string', () => {
        process.env.CLAUDE_CONFIG_DIR = '';
        const result = getProjectPath('/test/project');
        expect(result).toContain('.claude');
    });

    it('should handle paths with special characters', () => {
        const result = getProjectPath('/my.project/my_app');
        expect(result).toContain('-my-project');
        expect(result).toContain('-my-app');
    });
});
