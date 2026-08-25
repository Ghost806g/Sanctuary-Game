#pragma once
#include <memory>
#include <string>
#include "raylib.h"
#include "Screen.hpp"
#include "json.hpp"

using json = nlohmann::json;

class Game {
private:
    std::unique_ptr<Screen> currentScreen;
    std::unique_ptr<Screen> nextScreen;
    bool isRunning;
    json monsterDatabase;

public:
    Game(int width, int height, const char* title);
    ~Game();

    void Run();
    void ChangeScreen(std::unique_ptr<Screen> newScreen);
    void Quit();

    json GetMonsterData(const std::string& name);
};
