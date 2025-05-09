require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
// Configuración detallada de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "ultmill", // Asumiendo el nombre basado en 
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error("Error conectando a MongoDB:", err));

// Schemas

// User Schema
const UserSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, default: "en" },
  trialPeriodDays: { type: Number, default: 5 }
}, { timestamps: true });

// Articles Schema
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  tags: [String],
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// History Schema
const HistorySchema = new mongoose.Schema({
  userID: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Product Ingredients Schema
const ProductIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  properties: { type: Object },
  safetyLevel: { type: String }
}, { timestamps: true });

// Product Notes Schema
const ProductNoteSchema = new mongoose.Schema({
  productID: { type: String, required: true },
  userID: { type: String, required: true },
  note: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

// Wishlist Schema
const WishlistSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  productID: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Modelos
const User = mongoose.model("User", UserSchema, "user");
const Article = mongoose.model("Article", ArticleSchema, "articles");
const History = mongoose.model("History", HistorySchema, "history");
const ProductIngredient = mongoose.model("ProductIngredient", ProductIngredientSchema, "productingredients");
const ProductNote = mongoose.model("ProductNote", ProductNoteSchema, "productnotes");
const Wishlist = mongoose.model("Wishlist", WishlistSchema, "wishlist");

// RUTAS

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// Ruta de prueba para POST
app.post("/test", (req, res) => {
  console.log("Recibido POST en /test:", req.body);
  res.json({ 
    message: "POST recibido correctamente",
    body: req.body 
  });
});

// Rutas de Usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluir contraseñas
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password, language } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = new User({
      userID: new mongoose.Types.ObjectId().toString(),
      name,
      email,
      password: hashedPassword,
      language: language || "en"
    });
    
    await user.save();
    
    // Remover contraseña de la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Artículos
app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/articles", async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Historia
app.get("/history", async (req, res) => {
  try {
    const history = await History.find();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/history", async (req, res) => {
  try {
    const history = new History(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Ingredientes
app.get("/productingredients", async (req, res) => {
  try {
    const ingredients = await ProductIngredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/productingredients", async (req, res) => {
  try {
    const ingredient = new ProductIngredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Notas de Producto
app.get("/productnotes", async (req, res) => {
  try {
    const notes = await ProductNote.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/productnotes", async (req, res) => {
  try {
    const note = new ProductNote(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Wishlist
app.get("/wishlist", async (req, res) => {
  try {
    const wishlist = await Wishlist.find();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/wishlist", async (req, res) => {
  try {
    const item = new Wishlist(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    // Remover contraseña de la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    message: err.message 
  });
});

// Middleware para asegurar que todas las respuestas sean JSON
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    if (typeof body === 'string' && !res.get('Content-Type')?.includes('json')) {
      res.set('Content-Type', 'application/json');
      body = JSON.stringify({ message: body });
    }
    return originalSend.call(this, body);
  };
  next();
});

// Exportar para Vercel
module.exports = app;

// Iniciar servidor si no está en Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}