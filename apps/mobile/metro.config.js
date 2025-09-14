const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Allow Metro to follow packages above (monorepo) without dropping Expo defaults
config.watchFolders = [...config.watchFolders, workspaceRoot];

// Resolve modules from app and workspace to avoid conflicts
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Use Expo/React Native default transformer (no custom override)

module.exports = config;
