export default function (api) {
  api.cache(true);
  return {
    // Disable preset auto-injecting the old Reanimated plugin.
    presets: [["babel-preset-expo", { reanimated: false }]],
    // Inline NativeWind’s CSS interop without adding Reanimated,
    // and use Worklets as the only worklet plugin (keep last).
    plugins: [
      "react-native-css-interop/dist/babel-plugin",
      [
        "@babel/plugin-transform-react-jsx",
        { runtime: "automatic", importSource: "react-native-css-interop" },
      ],
      "react-native-worklets/plugin", // must be last
    ],
  };
}
