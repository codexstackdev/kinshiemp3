import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";

type TabIconProps = {
  focused: boolean;
  color: string;
  activeIcon: "home" | "musical-notes";
  inactiveIcon: "home-outline" | "musical-notes-outline";
};

function AnimatedTabIcon({
  focused,
  color,
  activeIcon,
  inactiveIcon,
}: TabIconProps) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      stiffness: 250,
      damping: 17,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [focused, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });
  const activeOpacity = progress;

  return (
    <View style={styles.iconArea}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeIconGlass,
          {
            opacity: activeOpacity,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          size={22}
          name={focused ? activeIcon : inactiveIcon}
          color={color}
        />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[styles.activeDot, { opacity: activeOpacity }]}
      />
    </View>
  );
}

function GlassTabBackground() {
  return (
    <View style={styles.glassBackground}>
      <BlurView tint="dark" intensity={72} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.glassTint} />
      <View pointerEvents="none" style={styles.topHighlight} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F5F0FF",
        tabBarInactiveTintColor: "#9294A6",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <GlassTabBackground />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon
              focused={focused}
              color={String(color)}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="music"
        options={{
          title: "Music",
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon
              focused={focused}
              color={String(color)}
              activeIcon="musical-notes"
              inactiveIcon="musical-notes-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    height: 76,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 7,
    borderTopWidth: 0,
    borderRadius: 26,
    backgroundColor: "transparent",
    overflow: "hidden",
    elevation: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
  },
  glassBackground: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    borderRadius: 26,
    backgroundColor: "rgba(19, 20, 31, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(24, 24, 38, 0.24)",
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 22,
    right: 22,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  tabItem: {
    paddingVertical: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 1,
  },
  iconArea: {
    width: 52,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconGlass: {
    position: "absolute",
    width: 48,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(158, 132, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(194, 176, 255, 0.16)",
  },
  activeDot: {
    position: "absolute",
    bottom: -1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C4B2FF",
  },
});
