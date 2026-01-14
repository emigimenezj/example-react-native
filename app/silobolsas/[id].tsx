import { silobagsCollection } from "@/lib/electric";
import { Ionicons } from "@expo/vector-icons";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SilobagDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const silobagId = Number(id);

  const { data: silobags, isLoading } = useLiveQuery((query) =>
    query
      .from({ silobag: silobagsCollection })
      .where(({ silobag }) => eq(silobag.id, silobagId))
  );

  const silobag = silobags?.[0];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BAA00" />
        <Text style={styles.loadingText}>Cargando detalle...</Text>
      </View>
    );
  }

  if (!silobag) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#8E8E93" />
        <Text style={styles.errorTitle}>Silobolsa no encontrada</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const baggingDate = new Date(silobag.bagging_date).toLocaleDateString(
    "es-AR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const createdDate = new Date(silobag.created_at).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.nameSection}>
          <Text style={styles.silobagName}>{silobag.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{silobag.species}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información general</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="scale-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Peso</Text>
              <Text style={styles.detailValue}>{silobag.weight} kg</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="resize-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tamaño</Text>
              <Text style={styles.detailValue}>{silobag.size}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="leaf-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Especie</Text>
              <Text style={styles.detailValue}>{silobag.species}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fechas</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fecha de embolsado</Text>
              <Text style={styles.detailValue}>{baggingDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="time-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fecha de registro</Text>
              <Text style={styles.detailValue}>{createdDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificación</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="finger-print-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>ID</Text>
              <Text style={styles.detailValue}>#{silobag.id}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color="#6BAA00" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Usuario ID</Text>
              <Text style={styles.detailValue}>{silobag.user_id}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  backButton: {
    backgroundColor: "#6BAA00",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nameSection: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  silobagName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  speciesBadge: {
    backgroundColor: "#F0F7E6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6BAA00",
  },
  speciesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6BAA00",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  detailIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7E6",
    borderRadius: 20,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  detailValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000000",
  },
});
