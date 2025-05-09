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

export default function SignupScreen() {
  const [loading, setLoading] = useState(false);
  
  // Estados para registro
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLanguage, setSignupLanguage] = useState("es");

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Intentando registrar con URL:", `${API_URL}/users`);
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          language: signupLanguage,
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
        Alert.alert(
          "Éxito", 
          "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
          [{ text: "OK", onPress: () => router.replace("/screens/SigninScreen") }]
        );
      } else {
        Alert.alert("Error", data.error || "No se pudo crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
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
            <Text style={styles.title}>Crear Cuenta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={signupName}
              onChangeText={setSignupName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />
            <View style={styles.languageContainer}>
              <Text style={styles.languageLabel}>Idioma:</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity 
                  style={[
                    styles.languageButton, 
                    signupLanguage === "es" && styles.languageButtonActive
                  ]}
                  onPress={() => setSignupLanguage("es")}
                >
                  <Text style={[
                    styles.languageButtonText,
                    signupLanguage === "es" && styles.languageButtonTextActive
                  ]}>Español</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.languageButton, 
                    signupLanguage === "en" && styles.languageButtonActive
                  ]}
                  onPress={() => setSignupLanguage("en")}
                >
                  <Text style={[
                    styles.languageButtonText,
                    signupLanguage === "en" && styles.languageButtonTextActive
                  ]}>English</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>
            
            {/* Cambiar a login */}
            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => router.replace("/screens/SigninScreen")}
            >
              <Text style={styles.switchButtonText}>
                ¿Ya tienes cuenta? Inicia sesión
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
  languageContainer: {
    marginBottom: 15,
  },
  languageLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  languageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  languageButtonText: {
    color: "#333",
  },
  languageButtonTextActive: {
    color: "#fff",
  },
});