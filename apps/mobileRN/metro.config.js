const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for pnpm monorepo
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Include root node_modules for pnpm hoisted packages
    path.resolve(__dirname, '../../node_modules'),
  ],
  resolver: {
    // Add support for node_modules at root for pnpm
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
