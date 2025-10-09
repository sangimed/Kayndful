import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Index() {
  const goSignUp = () => router.push("/register");
  const goLogin = () => router.push("/login");

  return (
    <LinearGradient
      colors={["#d1affd", "#e6d9f7", "#ece4f7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <View style={styles.centerBlock}>
        <LinearGradient
          colors={["#FFD9BE", "#F7BFC0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.appIcon}
        >
          <MaterialCommunityIcons
            name="hand-heart-outline"
            size={72}
            color="#fff"
          />
        </LinearGradient>

        <Text style={styles.title}>Kayndful</Text>
        <Text style={styles.subtitle}>
          Turns free time into acts of kindness 🫶
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={goSignUp}
            style={({ pressed }) => [
              styles.ctaContainer,
              pressed && { opacity: 0.95 },
            ]}
          >
            <LinearGradient
              colors={["#A8D5FF", "#b1e0ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryLabel}>Sign Up</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable
            onPress={goLogin}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.secondaryLabel}>Log In</Text>
          </Pressable>
        </View>      
      </View>

      <Text style={styles.footer}>New users require phone verification.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    // Reduce side padding so buttons get wider.
    paddingHorizontal: 16,
  },
  appIcon: {
    alignSelf: "center",
    alignItems: "center",
    width: 160,
    height: 160,
    borderRadius: 36,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    marginBottom: 28,
  },
  title: {
    alignSelf: "center",
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    alignItems: "center",
    fontSize: 20,
    lineHeight: 28,
    color: "#6B7280",
    textAlign: "center",
    marginHorizontal: 8,
    marginBottom: 28,
  },
  ctaContainer: {
    alignSelf: "stretch",
    width: "100%",
    borderRadius: 20,
    shadowColor: "#60A5FA",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryBtn: {
    alignItems: "center",
    height: 68,
    width: "100%",
    borderRadius: 15,
    justifyContent: "center",
    overflow: "hidden",
  },
  primaryLabel: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "center",
    height: 68,
  },
  secondaryLabel: {
    textAlign: 'center',  
    color: "#111827",
    fontSize: 20,
    fontWeight: "600",
  },
  actions: {
    alignItems: "stretch",
    gap: 16,
  },
  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    marginBottom: Platform.select({ ios: 24, android: 32 }),
    fontSize: 14,
  },
});
