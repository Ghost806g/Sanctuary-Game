#pragma once
#include "Screen.hpp"
#include "raylib.h"
#include <string>

struct Combatant {
    std::string name;
    int hp;
    int maxHp;
    float atb;
    float speed;
    Color color;
    
    int posture;
    int maxPosture;
    bool isStaggered;
    float staggerTimer;
    bool isPoisoned;
};

enum class CombatState {
    RUNNING_ATB,
    WAITING_PLAYER_INPUT,
    ENEMY_ATTACK_WINDUP,
    GAME_OVER
};

class CombatScreen : public Screen {
private:
    Combatant hero;
    Combatant enemy;
    CombatState state;
    
    std::string logMsg;
    int heroPotions;
    float windupTimer;
    float maxWindupTime;

public:
    void Enter(Game* game) override;
    void Update(Game* game, float dt) override;
    void Draw(Game* game) override;
    void Exit(Game* game) override;
};
