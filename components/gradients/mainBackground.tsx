import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

const MainBackgroundGradient = () => {
  return (
    <LinearGradient
      colors={["#053E46", "#A7F3F0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0.5, 1]}
      style={styles.background}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
});
export default MainBackgroundGradient;
