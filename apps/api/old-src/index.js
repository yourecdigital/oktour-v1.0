const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to transliterate Russian text to English
function transliterate(text) {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
    'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
    'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return text.replace(/[а-яёА-ЯЁ]/g, function(match) {
    return map[match] || match;
  }).replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create directory based on item name if available
    let subDir = 'general';
    
    // Try to get item name from request body
    if (req.body && req.body.name) {
      subDir = transliterate(req.body.name);
    } else if (req.body && req.body.title) {
      subDir = transliterate(req.body.title);
    }
    
    // Ensure subdirectory exists
    const targetDir = path.join(uploadsDir, subDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: function (req, file, cb) {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp|bmp|tiff/;
    const allowedVideoTypes = /mp4|webm|ogg|avi|mov|wmv|flv|mkv|3gp/;
    const extname = path.extname(file.originalname).toLowerCase();
    const isImage = allowedImageTypes.test(extname) && allowedImageTypes.test(file.mimetype);
    const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');
    
    if (isImage || isVideo) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Static uploads enabled
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup  
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
    // Add initial data after a short delay to ensure tables are created
    setTimeout(addInitialData, 1000);
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      bonus_points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tours table
    db.run(`CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration TEXT,
      destination TEXT,
      city TEXT,
      category TEXT DEFAULT 'Общие туры',
      tour_type TEXT,
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Hotels table
    db.run(`CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      location TEXT,
      stars INTEGER,
      category TEXT DEFAULT 'Общие отели',
      city TEXT,
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Foreign tours table
    db.run(`CREATE TABLE IF NOT EXISTS foreign_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      country TEXT,
      duration TEXT,
      highlights TEXT,
      tour_type TEXT,
      category TEXT DEFAULT 'Общие зарубежные туры',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Cruises table
    db.run(`CREATE TABLE IF NOT EXISTS cruises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      departure TEXT,
      duration TEXT,
      destination TEXT,
      category TEXT DEFAULT 'Общие круизы',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Services table
    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT DEFAULT 'Общие услуги',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Promotions table
    db.run(`CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      discount_percent INTEGER,
      valid_until TEXT,
      category TEXT DEFAULT 'Общие акции',
      image_url TEXT,
      active BOOLEAN DEFAULT 1
    )`);

    // Hero backgrounds table
    db.run(`CREATE TABLE IF NOT EXISTS hero_backgrounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_name TEXT NOT NULL UNIQUE,
      background_image_url TEXT,
      background_type TEXT DEFAULT 'image',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add fallback_image_url column if it doesn't exist (safe migration)
    db.all("PRAGMA table_info(hero_backgrounds)", (err, columns) => {
      if (err) {
        console.error('Error checking table info:', err);
        return;
      }
      
      const hasFallbackColumn = columns.some(col => col.name === 'fallback_image_url');
      if (!hasFallbackColumn) {
        db.run(`ALTER TABLE hero_backgrounds ADD COLUMN fallback_image_url TEXT`, (err) => {
          if (err) {
            console.error('Error adding fallback_image_url column:', err);
          } else {
            console.log('Added fallback_image_url column to hero_backgrounds table');
          }
        });
      } else {
        console.log('fallback_image_url column already exists');
      }
    });

    // Bonus history table
    db.run(`CREATE TABLE IF NOT EXISTS bonus_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      points INTEGER NOT NULL,
      type TEXT NOT NULL,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 1,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration TEXT,
      destination TEXT,
      capacity TEXT,
      features TEXT,
      country TEXT,
      highlights TEXT,
      departure TEXT,
      category TEXT
    )`);

    // Добавляем поле category если его нет (миграция)
    db.run("ALTER TABLE cart ADD COLUMN category TEXT", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding category column to cart:', err);
      }
    });

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id)
    )`);

    // Insert sample tours
    const sampleTours = [
      {
        name: 'Экскурсия по Сочи',
        description: 'Увлекательная экскурсия по главным достопримечательностям Сочи',
        price: 2500,
        duration: '4 часа',
        destination: 'Сочи',
        image_url: '/images/sochi-tour.jpg'
      },
      {
        name: 'Красная Поляна',
        description: 'Горнолыжный курорт и летний отдых в горах',
        price: 3500,
        duration: '8 часов',
        destination: 'Красная Поляна',
        image_url: '/images/krasnaya-polyana.jpg'
      },
      {
        name: 'Морская прогулка',
        description: 'Прогулка на катере по Черному морю',
        price: 1800,
        duration: '2 часа',
        destination: 'Сочи',
        image_url: '/images/sea-tour.jpg'
      },
      {
        name: 'Олимпийский парк',
        description: 'Посещение олимпийских объектов и парка развлечений',
        price: 2200,
        duration: '5 часов',
        destination: 'Адлер',
        image_url: '/images/olympic-park.jpg'
      }
    ];

    const insertTour = db.prepare('INSERT OR IGNORE INTO tours (name, description, price, duration, destination, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    sampleTours.forEach(tour => {
      insertTour.run(tour.name, tour.description, tour.price, tour.duration, tour.destination, tour.image_url);
    });
    insertTour.finalize();

    // Добавляем новые колонки если их нет (миграция)
    db.run("ALTER TABLE tours ADD COLUMN city TEXT", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding city column:', err);
      }
    });
    
    db.run("ALTER TABLE tours ADD COLUMN tour_type TEXT", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding tour_type column:', err);
      }
    });

    // Add city column to hotels table if it doesn't exist
    db.run("ALTER TABLE hotels ADD COLUMN city TEXT", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding city column to hotels:', err);
      }
    });
  });
}

// Function to add initial data if tables are empty
function addInitialData() {
  // Check if tours table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM tours', (err, row) => {
    if (err) {
      console.error('Error checking tours count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial tour data...');
      const sampleTours = [
        {
          name: 'Экскурсия по Красной площади',
          description: 'Познакомьтесь с историей и архитектурой главной площади России. Включает посещение Кремля, собора Василия Блаженного и ГУМа.',
          price: 2500,
          duration: '3 часа',
          destination: 'Москва',
          city: 'Москва',
          category: 'Исторические туры',
          tour_type: 'Экскурсия',
          available: 1
        },
        {
          name: 'Путешествие по Золотому кольцу',
          description: 'Посетите древние русские города с богатой историей: Суздаль, Владимир, Ярославль, Кострома.',
          price: 15000,
          duration: '5 дней',
          destination: 'Золотое кольцо',
          city: 'Суздаль',
          category: 'Культурные туры',
          tour_type: 'Многодневный тур',
          available: 1
        },
        {
          name: 'Природа Карелии',
          description: 'Откройте для себя красоты северной природы России: озера, леса, водопады и уникальная архитектура.',
          price: 8000,
          duration: '4 дня',
          destination: 'Карелия',
          city: 'Петрозаводск',
          category: 'Природные туры',
          tour_type: 'Активный отдых',
          available: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO tours (name, description, price, duration, destination, city, category, tour_type, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      sampleTours.forEach(tour => {
        stmt.run([tour.name, tour.description, tour.price, tour.duration, tour.destination, tour.city, tour.category, tour.tour_type, tour.available]);
      });
      stmt.finalize();
    }
  });

  // Check if hotels table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM hotels', (err, row) => {
    if (err) {
      console.error('Error checking hotels count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial hotel data...');
      const sampleHotels = [
        {
          name: 'Гранд Отель Москва',
          description: 'Роскошный отель в самом сердце столицы с видом на Красную площадь',
          price: 12000,
          location: 'Москва, центр',
          stars: 5,
          category: 'Люкс',
          available: 1
        },
        {
          name: 'Санкт-Петербург Плаза',
          description: 'Элегантный отель с видом на Неву в историческом центре города',
          price: 8500,
          location: 'Санкт-Петербург, центр',
          stars: 4,
          category: 'Бизнес',
          available: 1
        },
        {
          name: 'Сочи Марин',
          description: 'Современный отель на берегу Черного моря с собственным пляжем',
          price: 6500,
          location: 'Сочи, морское побережье',
          stars: 4,
          category: 'Курортный',
          available: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO hotels (name, description, price, location, stars, category, available) VALUES (?, ?, ?, ?, ?, ?, ?)');
      sampleHotels.forEach(hotel => {
        stmt.run([hotel.name, hotel.description, hotel.price, hotel.location, hotel.stars, hotel.category, hotel.available]);
      });
      stmt.finalize();
    }
  });

  // Check if foreign_tours table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM foreign_tours', (err, row) => {
    if (err) {
      console.error('Error checking foreign_tours count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial foreign tour data...');
      const sampleForeignTours = [
        {
          name: 'Романтический Париж',
          description: 'Незабываемое путешествие в город любви с посещением главных достопримечательностей',
          price: 45000,
          country: 'Франция',
          duration: '5 дней',
          highlights: JSON.stringify(['Эйфелева башня', 'Лувр', 'Нотр-Дам', 'Монмартр', 'Триумфальная арка']),
          category: 'Романтические туры',
          image_url: '/uploads/paris.jpg',
          available: 1
        },
        {
          name: 'Солнечная Италия',
          description: 'Познакомьтесь с культурой и кухней Италии, посетите Рим, Флоренцию и Венецию',
          price: 55000,
          country: 'Италия',
          duration: '7 дней',
          highlights: JSON.stringify(['Колизей', 'Ватикан', 'Пизанская башня', 'Гондолы Венеции', 'Фонтан Треви']),
          category: 'Культурные туры',
          image_url: '/uploads/italy.jpg',
          available: 1
        },
        {
          name: 'Тропический Таиланд',
          description: 'Отдых на райских пляжах с экскурсиями по храмам и национальным паркам',
          price: 35000,
          country: 'Таиланд',
          duration: '10 дней',
          highlights: JSON.stringify(['Храм Изумрудного Будды', 'Плавучий рынок', 'Острова Пхи-Пхи', 'Национальный парк Кхао Яй']),
          category: 'Пляжный отдых',
          image_url: '/uploads/thailand.jpg',
          available: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO foreign_tours (name, description, price, country, duration, highlights, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      sampleForeignTours.forEach(tour => {
        stmt.run([tour.name, tour.description, tour.price, tour.country, tour.duration, tour.highlights, tour.category, tour.image_url, tour.available]);
      });
      stmt.finalize();
    }
  });

  // Check if cruises table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM cruises', (err, row) => {
    if (err) {
      console.error('Error checking cruises count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial cruise data...');
      const sampleCruises = [
        {
          name: 'Круиз по Средиземному морю',
          description: 'Роскошный круиз по лучшим курортам Средиземноморья: Барселона, Ницца, Рим, Афины',
          price: 75000,
          departure: 'Барселона',
          duration: '10 дней',
          destination: 'Средиземное море',
          category: 'Люкс круизы',
          available: 1
        },
        {
          name: 'Северная Европа и Балтика',
          description: 'Путешествие по столицам Северной Европы: Копенгаген, Стокгольм, Хельсинки, Санкт-Петербург',
          price: 65000,
          departure: 'Копенгаген',
          duration: '8 дней',
          destination: 'Балтийское море',
          category: 'Культурные круизы',
          available: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO cruises (name, description, price, departure, duration, destination, category, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      sampleCruises.forEach(cruise => {
        stmt.run([cruise.name, cruise.description, cruise.price, cruise.departure, cruise.duration, cruise.destination, cruise.category, cruise.available]);
      });
      stmt.finalize();
    }
  });

  // Check if promotions table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM promotions', (err, row) => {
    if (err) {
      console.error('Error checking promotions count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial promotion data...');
      const samplePromotions = [
        {
          title: 'Скидка на туры по России',
          description: 'Получите скидку 20% на все туры по России при раннем бронировании. Предложение действует до конца месяца!',
          discount_percent: 20,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Туры по России',
          active: 1
        },
        {
          title: 'Специальное предложение на круизы',
          description: 'Бронируйте круизы заранее и получайте до 30% скидки. Включает все портовые сборы и экскурсии!',
          discount_percent: 30,
          valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Круизы',
          active: 1
        },
        {
          title: 'Раннее бронирование отелей',
          description: 'Забронируйте отель за 3 месяца до поездки и получите скидку 25% на проживание',
          discount_percent: 25,
          valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Отели',
          active: 1
        },
        {
          title: 'Горящие предложения',
          description: 'Последние места на популярные туры со скидкой до 40%!',
          discount_percent: 40,
          valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Горящие предложения',
          active: 1
        },
        {
          title: 'Семейные туры',
          description: 'Специальные условия для семей с детьми - скидка 25% на все семейные туры',
          discount_percent: 25,
          valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Семейные туры',
          active: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO promotions (title, description, discount_percent, valid_until, category, active) VALUES (?, ?, ?, ?, ?, ?)');
      samplePromotions.forEach(promotion => {
        stmt.run([promotion.title, promotion.description, promotion.discount_percent, promotion.valid_until, promotion.category, promotion.active]);
      });
      stmt.finalize();
    }
  });

  // Check if services table is empty and add sample data
  db.get('SELECT COUNT(*) as count FROM services', (err, row) => {
    if (err) {
      console.error('Error checking services count:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Adding initial service data...');
      const sampleServices = [
        {
          name: 'Трансфер из аэропорта',
          description: 'Комфортабельный трансфер из аэропорта в отель с опытным водителем',
          price: 2500,
          category: 'Транспортные услуги',
          available: 1
        },
        {
          name: 'Экскурсия с гидом',
          description: 'Индивидуальная экскурсия по городу с профессиональным гидом',
          price: 5000,
          category: 'Экскурсионные услуги',
          available: 1
        },
        {
          name: 'Бронирование ресторана',
          description: 'Бронирование столика в лучших ресторанах города',
          price: 1500,
          category: 'Ресторанные услуги',
          available: 1
        }
      ];

      const stmt = db.prepare('INSERT INTO services (name, description, price, category, available) VALUES (?, ?, ?, ?, ?)');
      sampleServices.forEach(service => {
        stmt.run([service.name, service.description, service.price, service.category, service.available]);
      });
      stmt.finalize();
    }
  });
}

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth header:', authHeader);
  console.log('Token:', token);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('User authenticated:', user);
    req.user = user;
    next();
  });
};

// Telegram bot setup
let bot;
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
}

// Send order to Telegram
async function sendOrderToTelegram(orderData) {
  if (!bot || !process.env.TELEGRAM_CHAT_ID) return;

  const message = `
🛒 НОВЫЙ ЗАКАЗ #${orderData.id}

👤 Покупатель: ${orderData.userName}
📧 Email: ${orderData.userEmail}
📱 Телефон: ${orderData.userPhone}

💰 Сумма: ${orderData.totalAmount} ₽
📅 Дата: ${new Date().toLocaleString('ru-RU')}

📋 Товары:
${orderData.items.map(item => `• ${item.name} x${item.quantity} - ${item.price} ₽`).join('\n')}
  `;

  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    console.error('Error sending to Telegram:', error);
  }
}

// API Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // console.log('Registration request:', { email, name, phone }); // Отладочная информация
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (email, password, name, phone, bonus_points) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || null, 500],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const userId = this.lastID;
        
        // Добавляем запись в историю бонусов
        db.run(
          'INSERT INTO bonus_history (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
          [userId, 500, 'earned', 'Бонус за регистрацию'],
          function(err) {
            if (err) {
              console.error('Error adding bonus history:', err);
            }
          }
        );
        
        const token = jwt.sign(
          { userId: userId, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        
        // console.log('User created with phone:', phone); // Отладочная информация
        
        res.json({ 
          token, 
          user: { 
            id: userId, 
            email, 
            name, 
            phone, 
            bonus_points: 500 
          },
          message: 'Регистрация успешна! Вам начислено 500 бонусов за регистрацию!'
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          bonusPoints: user.bonus_points
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, phone, bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      bonusPoints: user.bonus_points
    });
  });
});

// ===== BONUS SYSTEM API =====

// Get user bonus points
app.get('/api/bonus/points', authenticateToken, (req, res) => {
  db.get('SELECT bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ bonus_points: user.bonus_points });
  });
});

// Add bonus points to user
app.post('/api/bonus/add', authenticateToken, (req, res) => {
  const { points, reason } = req.body;
  
  if (!points || points <= 0) {
    return res.status(400).json({ error: 'Valid points amount is required' });
  }

  db.run(
    'UPDATE users SET bonus_points = bonus_points + ? WHERE id = ?',
    [points, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Добавляем запись в историю бонусов
      db.run(
        'INSERT INTO bonus_history (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
        [req.user.userId, points, 'earned', reason || 'Начисление бонусов'],
        function(err) {
          if (err) {
            console.error('Error adding bonus history:', err);
          }
        }
      );

      // Get updated bonus points
      db.get('SELECT bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
          message: `Начислено ${points} бонусов${reason ? ` за: ${reason}` : ''}`,
          bonus_points: user.bonus_points 
        });
      });
    }
  );
});

// Deduct bonus points from user
app.post('/api/bonus/deduct', authenticateToken, (req, res) => {
  const { points, reason } = req.body;
  
  if (!points || points <= 0) {
    return res.status(400).json({ error: 'Valid points amount is required' });
  }

  // Check if user has enough bonus points
  db.get('SELECT bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.bonus_points < points) {
      return res.status(400).json({ 
        error: 'Недостаточно бонусов',
        available_bonus_points: user.bonus_points,
        required_points: points
      });
    }

    db.run(
      'UPDATE users SET bonus_points = bonus_points - ? WHERE id = ?',
      [points, req.user.userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Добавляем запись в историю бонусов
        db.run(
          'INSERT INTO bonus_history (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
          [req.user.userId, points, 'spent', reason || 'Списание бонусов'],
          function(err) {
            if (err) {
              console.error('Error adding bonus history:', err);
            }
          }
        );
        
        // Get updated bonus points
        db.get('SELECT bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({ 
            message: `Списано ${points} бонусов${reason ? ` за: ${reason}` : ''}`,
            bonus_points: user.bonus_points 
          });
        });
      }
    );
  });
});

// Get bonus history
app.get('/api/bonus/history', authenticateToken, (req, res) => {
  // Получаем текущие бонусы пользователя
  db.get('SELECT bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Получаем историю бонусов
    db.all(
      'SELECT points, type, reason, created_at FROM bonus_history WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId],
      (err, history) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          bonus_history: history,
          current_bonus_points: user.bonus_points
        });
      }
    );
  });
});

// ===== ADMIN BONUS MANAGEMENT API =====

// Get all users for admin (with bonus points)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  // Проверяем, что это админ (можно добавить проверку роли)
  db.all('SELECT id, name, email, phone, bonus_points, created_at FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    // console.log('Admin users API response:', users); // Отладочная информация
    res.json(users);
  });
});

// Admin add bonus points to user
app.post('/api/admin/bonus/add', authenticateToken, (req, res) => {
  const { userId, points, reason } = req.body;
  
  if (!userId || !points || points <= 0) {
    return res.status(400).json({ error: 'Valid user ID and points amount are required' });
  }

  db.run(
    'UPDATE users SET bonus_points = bonus_points + ? WHERE id = ?',
    [points, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Добавляем запись в историю бонусов
      db.run(
        'INSERT INTO bonus_history (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
        [userId, points, 'earned', reason || 'Начисление администратором'],
        function(err) {
          if (err) {
            console.error('Error adding bonus history:', err);
          }
        }
      );

      // Get updated bonus points
      db.get('SELECT bonus_points FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
          message: `Начислено ${points} бонусов пользователю`,
          bonus_points: user.bonus_points 
        });
      });
    }
  );
});

// Admin deduct bonus points from user
app.post('/api/admin/bonus/deduct', authenticateToken, (req, res) => {
  const { userId, points, reason } = req.body;
  
  if (!userId || !points || points <= 0) {
    return res.status(400).json({ error: 'Valid user ID and points amount are required' });
  }

  // Check if user has enough bonus points
  db.get('SELECT bonus_points FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.bonus_points < points) {
      return res.status(400).json({ 
        error: 'Недостаточно бонусов у пользователя',
        available_bonus_points: user.bonus_points,
        required_points: points
      });
    }

    db.run(
      'UPDATE users SET bonus_points = bonus_points - ? WHERE id = ?',
      [points, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get updated bonus points
        db.get('SELECT bonus_points FROM users WHERE id = ?', [userId], (err, user) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({ 
            message: `Списано ${points} бонусов у пользователя`,
            bonus_points: user.bonus_points 
          });
        });
      }
    );
  });
});

// Admin get user orders
app.get('/api/admin/user/:userId/orders', authenticateToken, (req, res) => {
  const { userId } = req.params;
  
  db.all(
    `SELECT 
      o.*,
      GROUP_CONCAT(
        oi.item_type || ':' || oi.item_id || ':' || oi.quantity || ':' || oi.price,
        '|'
      ) as items_data
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC`,
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Parse items data
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: order.items_data ? 
          order.items_data.split('|').map(item => {
            const [type, id, quantity, price] = item.split(':');
            return { item_type: type, item_id: parseInt(id), quantity: parseInt(quantity), price: parseFloat(price) };
          }) : []
      }));
      
      res.json(ordersWithItems);
    }
  );
});

// Get tours
app.get('/api/tours', (req, res) => {
  db.all('SELECT * FROM tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

// Get tour by ID
app.get('/api/tours/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM tours WHERE id = ?', [id], (err, tour) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  });
});

// Create tour
app.post('/api/tours', authenticateToken, (req, res) => {
  const { name, description, price, duration, destination, city, category, tour_type, image_url, available } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'INSERT INTO tours (name, description, price, duration, destination, city, category, tour_type, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, duration || null, destination || null, city || null, category || 'Общие туры', tour_type || null, image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Tour created successfully' });
    }
  );
});

// Update tour
app.put('/api/tours/:id', authenticateToken, (req, res) => {
  const { name, description, price, duration, destination, city, category, tour_type, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'UPDATE tours SET name = ?, description = ?, price = ?, duration = ?, destination = ?, city = ?, category = ?, tour_type = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, duration || null, destination || null, city || null, category || 'Общие туры', tour_type || null, image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Tour not found' });
      }
      res.json({ message: 'Tour updated successfully' });
    }
  );
});

// Delete tour
app.delete('/api/tours/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tours WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json({ message: 'Tour deleted successfully' });
  });
});

// Get all tour categories
app.get('/api/tours/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM tours WHERE category IS NOT NULL AND category != ""', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories.map(cat => cat.category));
  });
});

// Get all tour cities
app.get('/api/tours/cities', (req, res) => {
  db.all('SELECT DISTINCT city FROM tours WHERE city IS NOT NULL AND city != "" UNION SELECT DISTINCT destination FROM tours WHERE destination IS NOT NULL AND destination != "" AND city IS NULL', (err, cities) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(cities.map(city => city.city || city.destination));
  });
});

// Get all tour types
app.get('/api/tours/types', (req, res) => {
  db.all('SELECT DISTINCT tour_type FROM tours WHERE tour_type IS NOT NULL AND tour_type != ""', (err, types) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(types.map(type => type.tour_type));
  });
});

// Get cart items
app.get('/api/cart', authenticateToken, (req, res) => {
  db.all(`
    SELECT id, item_id, item_type, name, description, price, quantity, added_at, duration, destination, capacity, features, country, highlights, departure
    FROM cart 
    WHERE user_id = ?
    ORDER BY added_at DESC
  `, [req.user.userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse features JSON for each item
    const items = cartItems.map(item => ({
      ...item,
      features: item.features ? JSON.parse(item.features) : null,
      highlights: item.highlights ? JSON.parse(item.highlights) : null
    }));
    
    res.json(items);
  });
});

// Add to cart
app.post('/api/cart/add', authenticateToken, (req, res) => {
  const { itemId, type, quantity = 1, itemData } = req.body;
  
  if (!itemId || !type || !itemData) {
    return res.status(400).json({ error: 'Item ID, type and item data are required' });
  }

  const features = itemData.features ? JSON.stringify(itemData.features) : null;
  const highlights = itemData.highlights ? JSON.stringify(itemData.highlights) : null;

  db.run(
    'INSERT INTO cart (user_id, item_id, item_type, name, description, price, quantity, duration, destination, capacity, features, country, highlights, departure, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.user.userId, 
      itemId, 
      type, 
      itemData.name, 
      itemData.description, 
      itemData.price, 
      quantity,
      itemData.duration || null,
      itemData.destination || null,
      itemData.capacity || null,
      features,
      itemData.country || null,
      highlights,
      itemData.departure || null,
      itemData.category || null
    ],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Added to cart', cartItemId: this.lastID });
    }
  );
});

// Remove from cart
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM cart WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      res.json({ message: 'Removed from cart' });
    }
  );
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Get cart items
    db.all(`
      SELECT id, item_id, item_type, name, description, price, quantity, duration, destination, capacity, features, country, highlights, departure
      FROM cart 
      WHERE user_id = ?
    `, [req.user.userId], async (err, cartItems) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [req.user.userId, totalAmount],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const orderId = this.lastID;

          // Add order items
          const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, item_id, item_type, quantity, price) VALUES (?, ?, ?, ?, ?)');
          cartItems.forEach(item => {
            insertOrderItem.run(orderId, item.item_id, item.item_type, item.quantity, item.price);
          });
          insertOrderItem.finalize();

          // Clear cart
          db.run('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);

          // Get user info for Telegram
          db.get('SELECT name, email, phone FROM users WHERE id = ?', [req.user.userId], (err, user) => {
            if (!err && user) {
              const orderData = {
                id: orderId,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone,
                totalAmount: totalAmount,
                items: cartItems.map(item => ({
                  name: item.name,
                  type: item.item_type,
                  quantity: item.quantity,
                  price: item.price * item.quantity
                }))
              };
              sendOrderToTelegram(orderData);
            }
          });

          res.json({ message: 'Order created successfully', orderId });
        }
      );
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get orders
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, oi.item_id, oi.item_type, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [req.user.userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Group items by order
    const groupedOrders = orders.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          totalAmount: row.total_amount,
          status: row.status,
          createdAt: row.created_at,
          items: []
        };
      }
      acc[row.id].items.push({
        itemId: row.item_id,
        itemType: row.item_type,
        quantity: row.quantity,
        price: row.price
      });
      return acc;
    }, {});

    res.json(Object.values(groupedOrders));
  });
});

// Add bonus points
app.post('/api/bonus/add', authenticateToken, (req, res) => {
  const { points = 500 } = req.body;
  
  db.run(
    'UPDATE users SET bonus_points = bonus_points + ? WHERE id = ?',
    [points, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: `Added ${points} bonus points` });
    }
  );
});

// ===== ADMIN AUTHENTICATION =====
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Простая проверка админа (в реальном проекте должна быть в базе данных)
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { adminId: 1, username: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Admin login successful' });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// ===== SERVICES API =====
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services WHERE available = 1', (err, services) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(services);
  });
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM services WHERE id = ?', [id], (err, service) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  });
});

app.post('/api/services', authenticateToken, (req, res) => {
  const { name, description, price, category, image_url, available } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'INSERT INTO services (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category || 'Общие услуги', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Service created successfully' });
    }
  );
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  const { name, description, price, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'UPDATE services SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, category || 'Общие услуги', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json({ message: 'Service updated successfully' });
    }
  );
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM services WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

// ===== HOTELS API =====
app.get('/api/hotels', (req, res) => {
  db.all('SELECT * FROM hotels WHERE available = 1', (err, hotels) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(hotels);
  });
});

// Get all unique cities from hotels
app.get('/api/hotels/cities', (req, res) => {
  db.all('SELECT DISTINCT city FROM hotels WHERE city IS NOT NULL AND city != "" ORDER BY city', (err, cities) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(cities.map(c => c.city));
  });
});

// Get hotel by ID
app.get('/api/hotels/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM hotels WHERE id = ?', [id], (err, hotel) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  });
});

app.post('/api/hotels', authenticateToken, (req, res) => {
  const { name, description, price, location, stars, category, city, image_url, available } = req.body;
  
  if (!name || !description || !price || !location) {
    return res.status(400).json({ error: 'Name, description, price and location are required' });
  }

  db.run(
    'INSERT INTO hotels (name, description, price, location, stars, category, city, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, location, stars || null, category || 'Общие отели', city || null, image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Hotel created successfully' });
    }
  );
});

app.put('/api/hotels/:id', authenticateToken, (req, res) => {
  const { name, description, price, location, stars, category, city, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !location) {
    return res.status(400).json({ error: 'Name, description, price and location are required' });
  }

  db.run(
    'UPDATE hotels SET name = ?, description = ?, price = ?, location = ?, stars = ?, category = ?, city = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, location, stars || null, category || 'Общие отели', city || null, image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      res.json({ message: 'Hotel updated successfully' });
    }
  );
});

app.delete('/api/hotels/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM hotels WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  });
});

// ===== FOREIGN TOURS API =====
app.get('/api/foreign', (req, res) => {
  db.all('SELECT * FROM foreign_tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

// Новый endpoint для зарубежных туров
app.get('/api/foreign-tours', (req, res) => {
  db.all('SELECT * FROM foreign_tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

// Get foreign tour by ID
app.get('/api/foreign-tours/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM foreign_tours WHERE id = ?', [id], (err, tour) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!tour) {
      return res.status(404).json({ error: 'Foreign tour not found' });
    }
    res.json(tour);
  });
});

app.post('/api/foreign', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, tour_type, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'INSERT INTO foreign_tours (name, description, price, country, duration, highlights, tour_type, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, country, duration || null, highlightsJson, tour_type || null, category || 'Общие зарубежные туры', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Foreign tour created successfully' });
    }
  );
});

// Новый endpoint для создания зарубежных туров
app.post('/api/foreign-tours', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'INSERT INTO foreign_tours (name, description, price, country, duration, highlights, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, country, duration || null, highlightsJson, category || 'Общие зарубежные туры', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Foreign tour created successfully' });
    }
  );
});

app.put('/api/foreign/:id', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, tour_type, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'UPDATE foreign_tours SET name = ?, description = ?, price = ?, country = ?, duration = ?, highlights = ?, tour_type = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, country, duration || null, highlightsJson, tour_type || null, image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Foreign tour not found' });
      }
      res.json({ message: 'Foreign tour updated successfully' });
    }
  );
});

// Новый endpoint для обновления зарубежных туров
app.put('/api/foreign-tours/:id', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'UPDATE foreign_tours SET name = ?, description = ?, price = ?, country = ?, duration = ?, highlights = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, country, duration || null, highlightsJson, category || null, image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Foreign tour not found' });
      }
      res.json({ message: 'Foreign tour updated successfully' });
    }
  );
});

app.delete('/api/foreign/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM foreign_tours WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Foreign tour not found' });
    }
    res.json({ message: 'Foreign tour deleted successfully' });
  });
});

// Новый endpoint для удаления зарубежных туров
app.delete('/api/foreign-tours/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM foreign_tours WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Foreign tour not found' });
    }
    res.json({ message: 'Foreign tour deleted successfully' });
  });
});

// ===== CRUISES API =====
app.get('/api/cruises', (req, res) => {
  db.all('SELECT * FROM cruises WHERE available = 1', (err, cruises) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(cruises);
  });
});

// Get cruise by ID
app.get('/api/cruises/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM cruises WHERE id = ?', [id], (err, cruise) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!cruise) {
      return res.status(404).json({ error: 'Cruise not found' });
    }
    res.json(cruise);
  });
});

app.post('/api/cruises', authenticateToken, (req, res) => {
  const { name, description, price, departure, duration, destination, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !departure) {
    return res.status(400).json({ error: 'Name, description, price and departure are required' });
  }

  db.run(
    'INSERT INTO cruises (name, description, price, departure, duration, destination, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, departure, duration || null, destination || null, category || 'Общие круизы', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Cruise created successfully' });
    }
  );
});

app.put('/api/cruises/:id', authenticateToken, (req, res) => {
  const { name, description, price, departure, duration, destination, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !departure) {
    return res.status(400).json({ error: 'Name, description, price and departure are required' });
  }

  db.run(
    'UPDATE cruises SET name = ?, description = ?, price = ?, departure = ?, duration = ?, destination = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, departure, duration || null, destination || null, category || 'Общие круизы', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cruise not found' });
      }
      res.json({ message: 'Cruise updated successfully' });
    }
  );
});

app.delete('/api/cruises/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM cruises WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cruise not found' });
    }
    res.json({ message: 'Cruise deleted successfully' });
  });
});

// ===== PROMOTIONS API =====
// Get random promotions for hero section (must be before /:id route)
app.get('/api/promotions/random', (req, res) => {
  const limit = parseInt(req.query.limit) || 1;
  
  db.all('SELECT * FROM promotions WHERE active = 1 AND (valid_until IS NULL OR valid_until > datetime("now")) ORDER BY RANDOM() LIMIT ?', [limit], (err, promotions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(promotions);
  });
});

app.get('/api/promotions', (req, res) => {
  db.all('SELECT * FROM promotions WHERE active = 1 AND (valid_until IS NULL OR valid_until > datetime("now"))', (err, promotions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(promotions);
  });
});

// Get promotion by ID
app.get('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM promotions WHERE id = ?', [id], (err, promotion) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(promotion);
  });
});

app.post('/api/promotions', authenticateToken, (req, res) => {
  const { title, description, discount_percent, valid_until, category, image_url, active } = req.body;
  
  if (!title || !description || !discount_percent) {
    return res.status(400).json({ error: 'Title, description and discount_percent are required' });
  }

  db.run(
    'INSERT INTO promotions (title, description, discount_percent, valid_until, category, image_url, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, discount_percent, valid_until || null, category || 'Общие акции', image_url || null, active ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Promotion created successfully' });
    }
  );
});

app.put('/api/promotions/:id', authenticateToken, (req, res) => {
  const { title, description, discount_percent, valid_until, image_url, active } = req.body;
  const { id } = req.params;
  
  if (!title || !description || !discount_percent) {
    return res.status(400).json({ error: 'Title, description and discount_percent are required' });
  }

  db.run(
    'UPDATE promotions SET title = ?, description = ?, discount_percent = ?, valid_until = ?, image_url = ?, active = ? WHERE id = ?',
    [title, description, discount_percent, valid_until || null, image_url || null, active ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      res.json({ message: 'Promotion updated successfully' });
    }
  );
});

app.delete('/api/promotions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM promotions WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted successfully' });
  });
});

// ===== CATEGORY DELETE API =====

// Удаление категории туров
app.delete('/api/tours/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM tours WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its tours deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// Удаление страны зарубежных туров
app.delete('/api/foreign-tours/category/:country', authenticateToken, (req, res) => {
  const { country } = req.params;
  const decodedCountry = decodeURIComponent(country);
  
  db.run('DELETE FROM foreign_tours WHERE country = ?', [decodedCountry], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Country "${decodedCountry}" and all its tours deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// Удаление категории круизов
app.delete('/api/cruises/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM cruises WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its cruises deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// Удаление категории акций
app.delete('/api/promotions/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM promotions WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its promotions deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// Удаление категории услуг
app.delete('/api/services/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM services WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its services deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// Удаление категории отелей
app.delete('/api/hotels/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM hotels WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its hotels deleted successfully`,
      deletedCount: this.changes 
    });
  });
});

// ===== HERO BACKGROUNDS API =====

// Get all hero backgrounds
app.get('/api/hero-backgrounds', (req, res) => {
  db.all('SELECT * FROM hero_backgrounds ORDER BY page_name', (err, backgrounds) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(backgrounds);
  });
});

// Get hero background by page name
app.get('/api/hero-backgrounds/:pageName', (req, res) => {
  const { pageName } = req.params;
  
  db.get('SELECT * FROM hero_backgrounds WHERE page_name = ?', [pageName], (err, background) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!background) {
      return res.status(404).json({ error: 'Hero background not found' });
    }
    res.json(background);
  });
});

// Create or update hero background
app.post('/api/hero-backgrounds', authenticateToken, (req, res) => {
  const { page_name, background_image_url, background_type = 'image', fallback_image_url } = req.body;
  
  if (!page_name) {
    return res.status(400).json({ error: 'Page name is required' });
  }

  // Check if background already exists
  db.get('SELECT id FROM hero_backgrounds WHERE page_name = ?', [page_name], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing) {
      // Update existing background
      db.run(
        'UPDATE hero_backgrounds SET background_image_url = ?, background_type = ?, fallback_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE page_name = ?',
        [background_image_url, background_type, fallback_image_url, page_name],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Hero background updated successfully', id: existing.id });
        }
      );
    } else {
      // Create new background
      db.run(
        'INSERT INTO hero_backgrounds (page_name, background_image_url, background_type, fallback_image_url) VALUES (?, ?, ?, ?)',
        [page_name, background_image_url, background_type, fallback_image_url],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Hero background created successfully', id: this.lastID });
        }
      );
    }
  });
});

// Delete hero background
app.delete('/api/hero-backgrounds/:pageName', authenticateToken, (req, res) => {
  const { pageName } = req.params;
  
  db.run('DELETE FROM hero_backgrounds WHERE page_name = ?', [pageName], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Hero background not found' });
    }
    res.json({ message: 'Hero background deleted successfully' });
  });
});

// ===== FILE UPLOAD (temporarily enabled) =====
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Создаем относительный путь от папки uploads
  const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];
  const imageUrl = `/uploads/${relativePath}`;
  
  res.json({
    success: true,
    imageUrl: imageUrl,
    message: 'File uploaded successfully'
  });
});

// Increase request size limits
app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




