#include "TitleScreen.hpp"
#include "HubScreen.hpp"
#include "Game.hpp"
#include <memory>

void TitleScreen::Enter(Game* game) {
    blinkTimer = 0.0f;
    showText = true;
}

void TitleScreen::Update(Game* game, float dt) {
    blinkTimer += dt;
    if (blinkTimer >= 0.5f) {
        showText = !showText;
        blinkTimer = 0.0f;
    }

    if (IsKeyPressed(KEY_ENTER)) {
        game->ChangeScreen(std::make_unique<HubScreen>());
    }
}

void TitleScreen::Draw(Game* game) {
    ClearBackground(RAYWHITE);
    DrawText("SANCTUARY", 250, 200, 50, DARKGRAY);
    DrawText("C++ Engine Edition", 270, 260, 20, GRAY);

    if (showText) {
        DrawText("PRESS ENTER to START", 240, 400, 25, BLACK);
    }
}

void TitleScreen::Exit(Game* game) {
}
