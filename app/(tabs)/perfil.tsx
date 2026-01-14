import { StyleSheet, Text, View } from "react-native";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Perfil</Text>
      <Text style={styles.description}>
        Aquí se mostrará el perfil del usuario
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
});
