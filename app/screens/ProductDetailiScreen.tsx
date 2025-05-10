import React from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Dimensions
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

// Interfaz para el producto
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  backgroundColor: string;
}

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const productData = params.productData ? JSON.parse(params.productData as string) : null;

  if (!productData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Producto no encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const product: Product = productData;
  
  // Generar estrellas basadas en la calificación
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={`star-${i}`} style={styles.starIcon}>⭐</Text>);
    }
    
    if (hasHalfStar) {
      stars.push(<Text key="half-star" style={styles.starIcon}>✭</Text>); // Representación de media estrella
    }
    
    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={styles.ratingText}>({product.rating})</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>
        
        {/* Imagen del producto (bloque de color) */}
        <View 
          style={[
            styles.productImage, 
            { backgroundColor: product.backgroundColor }
          ]} 
        />
        
        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          {renderStars()}
          
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.productDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>
        
        {/* Botón Agregar a la cesta */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>Agregar a la cesta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  productImage: {
    width: width,
    height: width * 0.8,
    marginBottom: 20,
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00C853",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  starIcon: {
    fontSize: 18,
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: "#00C853",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});