// =========================================================================
//  DATABASE SERVICE (dbService.js)
//  Gerencia a conexão com o banco de dados SQLite nativo do Tauri.
//  Responsável por salvar, carregar e inicializar a tabela de heróis.
// =========================================================================

import Database from '@tauri-apps/plugin-sql';

let db = null;

async function initDatabase() {
    if (db) return db;
    try {
        db = await Database.load('sqlite:sanctuary.db');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS heroes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                class TEXT NOT NULL,
                race TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 0,
                save_data TEXT,
                current_hp INTEGER,
                current_mana INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_played DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database initialized successfully.");
        return db;
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}

async function saveHero(heroData) {
    const database = await initDatabase();
    if (heroData.id) {
        await database.execute(
            `UPDATE heroes SET 
                name = $1, class = $2, race = $3, level = $4, experience = $5, 
                gold = $6, save_data = $7, current_hp = $8, current_mana = $9, 
                last_played = CURRENT_TIMESTAMP
             WHERE id = $10`,
            [
                heroData.name, heroData.class, heroData.race, heroData.level, heroData.experience,
                heroData.gold, JSON.stringify(heroData.save_data), heroData.current_hp, heroData.current_mana,
                heroData.id
            ]
        );
        return heroData.id;
    } else {
        const result = await database.execute(
            `INSERT INTO heroes (name, class, race, level, experience, gold, save_data, current_hp, current_mana) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                heroData.name, heroData.class, heroData.race, heroData.level || 1, heroData.experience || 0,
                heroData.gold || 0, JSON.stringify(heroData.save_data || {}), heroData.current_hp || 100, heroData.current_mana || 50
            ]
        );
        return result.lastInsertId;
    }
}

async function getHeroes() {
    const database = await initDatabase();
    const heroes = await database.select('SELECT * FROM heroes ORDER BY last_played DESC');
    return heroes.map(hero => ({
        ...hero,
        save_data: hero.save_data ? JSON.parse(hero.save_data) : {}
    }));
}

async function getHero(id) {
    const database = await initDatabase();
    const heroes = await database.select('SELECT * FROM heroes WHERE id = $1', [id]);
    if (heroes.length > 0) {
        const hero = heroes[0];
        hero.save_data = hero.save_data ? JSON.parse(hero.save_data) : {};
        return hero;
    }
    return null;
}

async function deleteHero(id) {
    const database = await initDatabase();
    await database.execute('DELETE FROM heroes WHERE id = $1', [id]);
}

// Attach to window so legacy scripts can use it
window.dbService = {
    initDatabase,
    saveHero,
    getHeroes,
    getHero,
    deleteHero
};
