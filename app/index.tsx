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

// URL de tu API (reemplazar con la URL de Vercel cuando esté desplegado)
const API_URL = "https://7ujm8uhb.vercel.app";

// Interfaz para el usuario
interface User {
  _id: string;
  userID: string;
  name: string;
  email: string;
  language: string;
  trialPeriodDays: number;
}

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Estados para registro
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLanguage, setSignupLanguage] = useState("es");

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

      // Primero verificamos el tipo de 
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
        setUser(data.user);
        Alert.alert("Éxito", "Has iniciado sesión correctamente");
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

      // Primero verificamos el tipo de contenido
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
          [{ text: "OK", onPress: () => setIsLogin(true) }]
        );
        // Limpiar campos de registro
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
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

  // Si el usuario está logueado, mostramos una pantalla de bienvenida
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>¡Bienvenido, {user.name}!</Text>
          <Text style={styles.welcomeSubtitle}>Email: {user.email}</Text>
          <Text style={styles.welcomeSubtitle}>Idioma: {user.language}</Text>
          <Text style={styles.welcomeSubtitle}>Días de prueba: {user.trialPeriodDays}</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={() => setUser(null)}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Text>
            
            {/* Formulario de Login */}
            {isLogin ? (
              <>
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
              </>
            ) : (
              /* Formulario de Registro */
              <>
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
              </>
            )}
            
            {/* Cambiar entre login y registro */}
            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin 
                  ? "¿No tienes cuenta? Regístrate" 
                  : "¿Ya tienes cuenta? Inicia sesión"}
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
  logoutButton: {
    backgroundColor: "#dc3545",
    marginTop: 20,
    width: 200,
  },
});