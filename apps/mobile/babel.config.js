module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Keep plugin list minimal to avoid Babel conflicts.
    // If build succeeds, re-add NativeWind below expo-router.
    plugins: [
      "expo-router/babel",
      "react-native-worklets/plugin", // must be last
    ],
  };
};
