#include "Game.hpp"
#include <fstream>
#include <iostream>

Game::Game(int width, int height, const char* title) {
    InitWindow(width, height, title);
    SetTargetFPS(60);
    isRunning = true;
    
    std::ifstream file("vendor/database.json");
    if (file.is_open()) {
        file >> monsterDatabase;
    } else {
        std::cerr << "Erro ao abrir database.json!" << std::endl;
    }
}

Game::~Game() {
    if (currentScreen) currentScreen->Exit(this);
    CloseWindow();
}

json Game::GetMonsterData(const std::string& name) {
    if (monsterDatabase.contains(name)) {
        return monsterDatabase[name];
    }
    return {};
}

void Game::ChangeScreen(std::unique_ptr<Screen> newScreen) {
    nextScreen = std::move(newScreen);
}

void Game::Quit() {
    isRunning = false;
}

void Game::Run() {
    while (isRunning && !WindowShouldClose()) {
        if (nextScreen) {
            if (currentScreen) currentScreen->Exit(this);
            currentScreen = std::move(nextScreen);
            currentScreen->Enter(this);
        }

        if (currentScreen) {
            float dt = GetFrameTime();
            currentScreen->Update(this, dt);

            BeginDrawing();
            currentScreen->Draw(this);
            EndDrawing();
        } else {
            BeginDrawing();
            ClearBackground(BLACK);
            EndDrawing();
        }
    }
}
