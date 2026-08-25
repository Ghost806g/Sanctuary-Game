use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct Hero {
    pub id: i32,
    pub name: String,
    pub class: String,
    pub race: String,
    pub level: Option<i32>,
    pub save_data: Option<serde_json::Value>,
}

#[tauri::command]
async fn get_heroes() -> Result<Vec<Hero>, String> {
    Ok(vec![])
}

#[tauri::command]
async fn create_hero(
    name: String,
    class: String,
    race: Option<String>,
    save_data: Option<serde_json::Value>,
) -> Result<i32, String> {
    Ok(1)
}

#[tauri::command]
async fn update_hero(
    id: i32,
    save_data: Option<serde_json::Value>,
    level: Option<i32>,
) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
async fn delete_hero(
    id: i32,
) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
fn set_fullscreen(window: tauri::Window, state: bool) -> Result<(), String> {
    window.set_fullscreen(state).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(move |app| {
            if cfg!(debug_assertions) {
                // app.handle().plugin(
                //   tauri_plugin_log::Builder::default()
                //     .level(log::LevelFilter::Info)
                //     .build(),
                // )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_heroes,
            create_hero,
            update_hero,
            delete_hero,
            set_fullscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

