#pragma once
#include "Screen.hpp"
#include "raylib.h"

class TitleScreen : public Screen {
private:
    float blinkTimer;
    bool showText;
public:
    void Enter(Game* game) override;
    void Update(Game* game, float dt) override;
    void Draw(Game* game) override;
    void Exit(Game* game) override;
};
