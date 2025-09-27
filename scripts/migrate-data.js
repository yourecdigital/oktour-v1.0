const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configuration
const SQLITE_DB_PATH = './database.sqlite';
const UPLOADS_DIR = './server/uploads';
const MINIO_ENDPOINT = 'localhost';
const MINIO_PORT = 9000;
const MINIO_ACCESS_KEY = 'minioadmin';
const MINIO_SECRET_KEY = 'minioadmin123';
const MINIO_BUCKET = 'tour-media';
const MINIO_USE_SSL = false;

// Initialize clients
const prisma = new PrismaClient();
const s3Client = new S3Client({
  endpoint: `http://${MINIO_ENDPOINT}:${MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Migration statistics
const stats = {
  tours: { migrated: 0, failed: 0, total: 0 },
  users: { migrated: 0, failed: 0, total: 0 },
  categories: { migrated: 0, failed: 0, total: 0 },
  media: { migrated: 0, failed: 0, total: 0 },
  files: { uploaded: 0, failed: 0, total: 0 },
  urls: { generated: 0, failed: 0, total: 0 }
};

// Helper function to get file stats
function getFileStats(dir) {
  let totalFiles = 0;
  let totalSize = 0;
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else {
        totalFiles++;
        totalSize += stat.size;
      }
    }
  }
  
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
  
  return { totalFiles, totalSize };
}

// Upload file to MinIO
async function uploadFileToMinIO(filePath, key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: getContentType(filePath),
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error.message);
    return false;
  }
}

// Get content type based on file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.avi': 'video/avi',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

// Generate public URL for MinIO object
async function generatePublicUrl(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 365 }); // 1 year
    return url;
  } catch (error) {
    console.error(`Failed to generate URL for ${key}:`, error.message);
    return null;
  }
}

// Migrate categories
async function migrateCategories(db) {
  console.log('🔄 Migrating categories...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', async (err, rows) => {
      if (err) {
        console.error('Error reading categories:', err);
        reject(err);
        return;
      }
      
      stats.categories.total = rows.length;
      
      for (const row of rows) {
        try {
          await prisma.category.create({
            data: {
              id: row.id,
              name: row.name,
              description: row.description || '',
              slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
              isActive: row.is_active !== 0,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            },
          });
          stats.categories.migrated++;
        } catch (error) {
          console.error(`Failed to migrate category ${row.id}:`, error.message);
          stats.categories.failed++;
        }
      }
      
      console.log(`✅ Categories migrated: ${stats.categories.migrated}/${stats.categories.total}`);
      resolve();
    });
  });
}

// Migrate users
async function migrateUsers(db) {
  console.log('🔄 Migrating users...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', async (err, rows) => {
      if (err) {
        console.error('Error reading users:', err);
        reject(err);
        return;
      }
      
      stats.users.total = rows.length;
      
      for (const row of rows) {
        try {
          await prisma.user.create({
            data: {
              id: row.id,
              email: row.email,
              username: row.username,
              password: row.password, // Note: In production, you'd want to hash this
              role: row.role || 'USER',
              isActive: row.is_active !== 0,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            },
          });
          stats.users.migrated++;
        } catch (error) {
          console.error(`Failed to migrate user ${row.id}:`, error.message);
          stats.users.failed++;
        }
      }
      
      console.log(`✅ Users migrated: ${stats.users.migrated}/${stats.users.total}`);
      resolve();
    });
  });
}

// Migrate tours
async function migrateTours(db) {
  console.log('🔄 Migrating tours...');
  
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tours', async (err, rows) => {
      if (err) {
        console.error('Error reading tours:', err);
        reject(err);
        return;
      }
      
      stats.tours.total = rows.length;
      
      for (const row of rows) {
        try {
          await prisma.tour.create({
            data: {
              id: row.id,
              title: row.title,
              description: row.description || '',
              price: parseFloat(row.price) || 0,
              duration: row.duration || '',
              location: row.location || '',
              categoryId: row.category_id,
              isActive: row.is_active !== 0,
              featured: row.featured !== 0,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            },
          });
          stats.tours.migrated++;
        } catch (error) {
          console.error(`Failed to migrate tour ${row.id}:`, error.message);
          stats.tours.failed++;
        }
      }
      
      console.log(`✅ Tours migrated: ${stats.tours.migrated}/${stats.tours.total}`);
      resolve();
    });
  });
}

// Upload media files to MinIO
async function uploadMediaFiles() {
  console.log('🔄 Uploading media files to MinIO...');
  
  const fileStats = getFileStats(UPLOADS_DIR);
  stats.files.total = fileStats.totalFiles;
  
  console.log(`📁 Found ${fileStats.totalFiles} files (${(fileStats.totalSize / 1024 / 1024).toFixed(2)} MB)`);
  
  function uploadDirectory(currentDir, baseKey = '') {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        uploadDirectory(filePath, path.join(baseKey, file));
      } else {
        const key = path.join(baseKey, file).replace(/\\/g, '/');
        
        if (uploadFileToMinIO(filePath, key)) {
          stats.files.uploaded++;
        } else {
          stats.files.failed++;
        }
      }
    }
  }
  
  if (fs.existsSync(UPLOADS_DIR)) {
    uploadDirectory(UPLOADS_DIR);
  }
  
  console.log(`✅ Files uploaded: ${stats.files.uploaded}/${stats.files.total}`);
}

// Generate public URLs and update media records
async function generatePublicUrls() {
  console.log('🔄 Generating public URLs...');
  
  // This would typically involve updating media records with public URLs
  // For now, we'll simulate this process
  
  const mediaFiles = [
    'general/hero-background.mp4',
    'general/hero-background-mobile.mp4',
    'general/hero-background-fallback.jpg',
    'italy.jpg',
    'paris.jpg',
    'thailand.jpg'
  ];
  
  stats.urls.total = mediaFiles.length;
  
  for (const file of mediaFiles) {
    const url = await generatePublicUrl(file);
    if (url) {
      stats.urls.generated++;
      console.log(`🔗 Generated URL for ${file}`);
    } else {
      stats.urls.failed++;
    }
  }
  
  console.log(`✅ URLs generated: ${stats.urls.generated}/${stats.urls.total}`);
}

// Main migration function
async function migrateData() {
  console.log('🚀 Starting data migration...');
  console.log('=' .repeat(50));
  
  try {
    // Connect to SQLite database
    const db = new sqlite3.Database(SQLITE_DB_PATH);
    
    // Migrate data in order
    await migrateCategories(db);
    await migrateUsers(db);
    await migrateTours(db);
    
    // Close SQLite connection
    db.close();
    
    // Upload files to MinIO
    await uploadMediaFiles();
    
    // Generate public URLs
    await generatePublicUrls();
    
    // Close Prisma connection
    await prisma.$disconnect();
    
    // Print summary
    printSummary();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Print migration summary
function printSummary() {
  console.log('\n' + '=' .repeat(50));
  console.log('📊 MIGRATION SUMMARY');
  console.log('=' .repeat(50));
  
  const tables = [
    { name: 'Categories', data: stats.categories },
    { name: 'Users', data: stats.users },
    { name: 'Tours', data: stats.tours },
  ];
  
  console.log('\n📋 Database Records:');
  tables.forEach(table => {
    const success = table.data.migrated;
    const total = table.data.total;
    const coverage = total > 0 ? ((success / total) * 100).toFixed(1) : '0.0';
    console.log(`  ${table.name.padEnd(12)}: ${success.toString().padStart(3)}/${total} (${coverage}%)`);
  });
  
  console.log('\n📁 Media Files:');
  const fileSuccess = stats.files.uploaded;
  const fileTotal = stats.files.total;
  const fileCoverage = fileTotal > 0 ? ((fileSuccess / fileTotal) * 100).toFixed(1) : '0.0';
  console.log(`  Uploaded      : ${fileSuccess.toString().padStart(3)}/${fileTotal} (${fileCoverage}%)`);
  
  console.log('\n🔗 Public URLs:');
  const urlSuccess = stats.urls.generated;
  const urlTotal = stats.urls.total;
  const urlCoverage = urlTotal > 0 ? ((urlSuccess / urlTotal) * 100).toFixed(1) : '0.0';
  console.log(`  Generated     : ${urlSuccess.toString().padStart(3)}/${urlTotal} (${urlCoverage}%)`);
  
  // Calculate overall coverage
  const totalRecords = stats.categories.total + stats.users.total + stats.tours.total;
  const totalMigrated = stats.categories.migrated + stats.users.migrated + stats.tours.migrated;
  const overallCoverage = totalRecords > 0 ? ((totalMigrated / totalRecords) * 100).toFixed(1) : '0.0';
  
  console.log('\n🎯 Overall Coverage:');
  console.log(`  Database      : ${overallCoverage}%`);
  console.log(`  Media Files   : ${fileCoverage}%`);
  console.log(`  Public URLs   : ${urlCoverage}%`);
  
  console.log('\n✅ Migration completed successfully!');
}

// Run migration
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData, stats };
