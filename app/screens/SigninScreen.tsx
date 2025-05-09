import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { router } from "expo-router";

// URL de tu API
const API_URL = "https://7ujm8uhb.vercel.app";

export default function SigninScreen() {
  const [loading, setLoading] = useState(false);
  
  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Intentando hacer login con URL:", `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      // Verificar el tipo de contenido
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Respuesta no es JSON:", text);
        Alert.alert("Error", "El servidor no devolvió un JSON válido");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Guardar el usuario en local storage o context
        // Para este ejemplo, simplemente pasamos los datos a la pantalla de inicio
        Alert.alert("Éxito", "Has iniciado sesión correctamente");
        router.replace({
          pathname: "/screens/HomeScreen",
          params: { userData: JSON.stringify(data.user) }
        });
      } else {
        Alert.alert("Error", data.error || "No se pudo iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
            
            {/* Cambiar a registro */}
            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => router.replace("/screens/SignupScreen")}
            >
              <Text style={styles.switchButtonText}>
                ¿No tienes cuenta? Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#007bff",
    fontSize: 14,
  },
});