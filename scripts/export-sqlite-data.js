#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

async function exportSQLiteData() {
  console.log('🔄 Exporting SQLite data to JSON...');
  
  const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ SQLite database not found at:', dbPath);
    return;
  }

  const db = new sqlite3.Database(dbPath);
  
  const exportTable = (tableName) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
          console.log(`⚠️  Table ${tableName} not found or empty`);
          resolve([]);
        } else {
          console.log(`✅ Exported ${rows.length} records from ${tableName}`);
          resolve(rows);
        }
      });
    });
  };

  try {
    // Export all tables
    const [tours, users, categories, heroBackgrounds, services, hotels, cruises, promotions, foreignTours] = await Promise.all([
      exportTable('tours'),
      exportTable('users'),
      exportTable('categories'),
      exportTable('hero_backgrounds'),
      exportTable('services'),
      exportTable('hotels'),
      exportTable('cruises'),
      exportTable('promotions'),
      exportTable('foreign_tours')
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      source: 'sqlite_database.sqlite',
      tables: {
        tours,
        users,
        categories,
        hero_backgrounds: heroBackgrounds,
        services,
        hotels,
        cruises,
        promotions,
        foreign_tours: foreignTours
      }
    };

    const outputPath = path.join(process.cwd(), 'apps', 'api', 'data', 'legacy-export.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    
    console.log('✅ Data exported successfully to:', outputPath);
    console.log(`📊 Total records: ${Object.values(exportData.tables).flat().length}`);
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    db.close();
  }
}

exportSQLiteData();

