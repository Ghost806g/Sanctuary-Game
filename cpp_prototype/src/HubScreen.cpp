#include "HubScreen.hpp"
#include "CombatScreen.hpp"
#include "Game.hpp"

void HubScreen::Enter(Game* game) {
    tabs = {"INVENTARIO", "HABILIDADES", "BESTIARIO", "FORJA", "EXPLORACAO"};
    currentTab = 4; // Começa na aba de exploração para facilitar
}

void HubScreen::Update(Game* game, float dt) {
    if (IsKeyPressed(KEY_RIGHT)) {
        currentTab++;
        if (currentTab >= tabs.size()) currentTab = 0;
    }
    if (IsKeyPressed(KEY_LEFT)) {
        currentTab--;
        if (currentTab < 0) currentTab = (int)tabs.size() - 1;
    }

    if (IsKeyPressed(KEY_ENTER)) {
        if (tabs[currentTab] == "EXPLORACAO") {
            game->ChangeScreen(std::make_unique<CombatScreen>());
        }
    }
}

void HubScreen::Draw(Game* game) {
    ClearBackground(DARKGRAY);
    
    // Desenha Header das abas
    int tabWidth = 800 / (int)tabs.size();
    for (size_t i = 0; i < tabs.size(); i++) {
        Color bgColor = (i == currentTab) ? LIGHTGRAY : GRAY;
        Color textColor = (i == currentTab) ? BLACK : LIGHTGRAY;
        
        DrawRectangle((int)i * tabWidth, 0, tabWidth, 50, bgColor);
        DrawText(tabs[i].c_str(), (int)i * tabWidth + 10, 15, 15, textColor);
    }

    // Desenha Conteúdo da aba atual
    DrawText(TextFormat("Bem vindo a aba: %s", tabs[currentTab].c_str()), 50, 150, 30, RAYWHITE);
    
    if (tabs[currentTab] == "EXPLORACAO") {
        DrawText("Aperte ENTER para cacar a Aranha das Criptas!", 50, 250, 20, GREEN);
    } else {
        DrawText("Em construcao... Use as SETAS para navegar.", 50, 250, 20, YELLOW);
    }
}

void HubScreen::Exit(Game* game) {
}
