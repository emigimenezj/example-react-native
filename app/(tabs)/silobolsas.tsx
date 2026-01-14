import { silobagsCollection, type Silobag } from "@/lib/electric";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@react-navigation/elements";
import { useLiveQuery } from "@tanstack/react-db";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SilobolsasScreen() {
  const { data: silobags, isLoading } = useLiveQuery((query) =>
    query.from({ silobag: silobagsCollection })
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BAA00" />
        <Text style={styles.loadingText}>Cargando silobolsas...</Text>
      </View>
    );
  }

  if (!silobags || silobags.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay silobolsas</Text>
        <Text style={styles.emptyDescription}>
          Todavía no se han registrado silobolsas
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          silobagsCollection.insert({
            id: Date.now(),
            user_id: 1,
            name: "Silo prueba offline",
            weight: Date.now(),
            size: "256m",
            species: "trigo",
            bagging_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }}
      >
        Agregar silobolsa
      </Button>

      <FlatList
        data={silobags}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SilobagCard silobag={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

interface SilobagCardProps {
  silobag: Silobag;
}

function SilobagCard({ silobag }: SilobagCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/silobolsas/${silobag.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{silobag.name}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardSpecies}>{silobag.species}</Text>
            <Text style={styles.cardSeparator}>•</Text>
            <Text style={styles.cardWeight}>{silobag.weight} kg</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContainer: {
    padding: 16,
    gap: 12,
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
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
    gap: 6,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardSpecies: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6BAA00",
  },
  cardSeparator: {
    fontSize: 15,
    color: "#C7C7CC",
  },
  cardWeight: {
    fontSize: 15,
    color: "#8E8E93",
  },
});
