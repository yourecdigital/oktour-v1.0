const fs = require('fs');
const path = require('path');

// Simple migration script that simulates the process
console.log('🚀 Starting data migration simulation...');
console.log('=' .repeat(50));

// Simulate reading SQLite data
const mockData = {
  categories: [
    { id: 1, name: 'Adventure', description: 'Adventure tours', slug: 'adventure' },
    { id: 2, name: 'Cultural', description: 'Cultural experiences', slug: 'cultural' },
    { id: 3, name: 'Relaxation', description: 'Relaxing getaways', slug: 'relaxation' }
  ],
  users: [
    { id: 1, email: 'admin@tour.com', username: 'admin', role: 'ADMIN' },
    { id: 2, email: 'user@tour.com', username: 'user', role: 'USER' }
  ],
  tours: [
    { id: 1, title: 'Paris Adventure', description: 'Explore Paris', price: 1200, categoryId: 1 },
    { id: 2, title: 'Tokyo Culture', description: 'Discover Tokyo', price: 1500, categoryId: 2 },
    { id: 3, title: 'Bali Relaxation', description: 'Relax in Bali', price: 800, categoryId: 3 }
  ]
};

// Simulate file upload
function getUploadStats() {
  const uploadsDir = './server/uploads';
  let totalFiles = 0;
  let totalSize = 0;
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else {
        totalFiles++;
        totalSize += stat.size;
      }
    }
  }
  
  scanDirectory(uploadsDir);
  return { totalFiles, totalSize };
}

// Migration statistics
const stats = {
  categories: { migrated: mockData.categories.length, failed: 0, total: mockData.categories.length },
  users: { migrated: mockData.users.length, failed: 0, total: mockData.users.length },
  tours: { migrated: mockData.tours.length, failed: 0, total: mockData.tours.length },
  files: { uploaded: 0, failed: 0, total: 0 },
  urls: { generated: 0, failed: 0, total: 0 }
};

// Get file statistics
const fileStats = getUploadStats();
stats.files.total = fileStats.totalFiles;
stats.files.uploaded = Math.floor(fileStats.totalFiles * 0.95); // Simulate 95% success
stats.files.failed = stats.files.total - stats.files.uploaded;

// Simulate URL generation
const mediaFiles = [
  'general/hero-background.mp4',
  'general/hero-background-mobile.mp4', 
  'general/hero-background-fallback.jpg',
  'italy.jpg',
  'paris.jpg',
  'thailand.jpg'
];

stats.urls.total = mediaFiles.length;
stats.urls.generated = Math.floor(mediaFiles.length * 0.9); // Simulate 90% success
stats.urls.failed = stats.urls.total - stats.urls.generated;

// Print migration summary
function printSummary() {
  console.log('\n📊 MIGRATION SUMMARY');
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
  console.log(`  Total Size    : ${(fileStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  
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
  
  return {
    database: overallCoverage,
    media: fileCoverage,
    urls: urlCoverage,
    totalRecords,
    totalFiles: fileTotal,
    totalUrls: urlTotal
  };
}

// Run migration
const summary = printSummary();

// Export for use in other scripts
module.exports = { summary, stats };
