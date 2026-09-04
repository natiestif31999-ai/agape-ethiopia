import { Pressable, StyleSheet, Text } from "react-native";

export function Button({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, secondary && styles.secondaryButton]}><Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({ button: { minHeight: 54, borderRadius: 16, backgroundColor: "#0E766E", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 13 }, buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 }, secondaryButton: { backgroundColor: "#E1ECE7" }, secondaryButtonText: { color: "#19544D" } });
