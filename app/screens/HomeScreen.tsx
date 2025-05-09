import React, { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Interfaz para el usuario
interface User {
  _id: string;
  userID: string;
  name: string;
  email: string;
  language: string;
  trialPeriodDays: number;
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const params = useLocalSearchParams();
  
  useEffect(() => {
    if (params.userData) {
      try {
        // Parse the JSON string from params
        const userData = JSON.parse(params.userData as string);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        Alert.alert("Error", "No se pudo cargar la información del usuario");
        // Redirect to login if we can't parse the user data
        router.replace("/screens/SigninScreen");
      }
    } else {
      // If no user data, redirect to login
      router.replace("/screens/SigninScreen");
    }
  }, [params.userData]);

  const handleLogout = () => {
    setUser(null);
    router.replace("/screens/SigninScreen");
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>¡Bienvenido, {user.name}!</Text>
        <Text style={styles.welcomeSubtitle}>Email: {user.email}</Text>
        <Text style={styles.welcomeSubtitle}>Idioma: {user.language}</Text>
        <Text style={styles.welcomeSubtitle}>Días de prueba: {user.trialPeriodDays}</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    marginTop: 20,
    width: 200,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});