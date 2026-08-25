#include "CombatScreen.hpp"
#include "HubScreen.hpp"
#include "Game.hpp"
#include "json.hpp"

void CombatScreen::Enter(Game* game) {
    hero = {"Nephalem", 100, 100, 0.0f, 15.0f, BLUE, 100, 100, false, 0.0f, false};
    heroPotions = 3;
    
    nlohmann::json enemyData = game->GetMonsterData("Aranha das Criptas");
    if (!enemyData.empty()) {
        int hp = enemyData.value("hp", 100);
        float spd = enemyData.value("speed", 12.0f);
        enemy = {enemyData["name"], hp, hp, 0.0f, spd, RED, 100, 100, false, 0.0f, false};
    } else {
        enemy = {"Aranha das Criptas", 150, 150, 0.0f, 12.0f, RED, 100, 100, false, 0.0f, false};
    }
    
    state = CombatState::RUNNING_ATB;
    logMsg = "Combate Iniciado!";
    maxWindupTime = 0.5f; // Janela de Parry inicial de 500ms
}

void CombatScreen::Update(Game* game, float dt) {
    if (hero.hp <= 0 || enemy.hp <= 0) {
        if (state != CombatState::GAME_OVER) {
            state = CombatState::GAME_OVER;
        }
    }

    if (state == CombatState::GAME_OVER) {
        static float gameOverTimer = 0.0f;
        gameOverTimer += dt;
        if (gameOverTimer >= 2.0f) {
            gameOverTimer = 0.0f;
            game->ChangeScreen(std::make_unique<HubScreen>());
        }
        return;
    }

    // Lógica de Veneno (Poison DoT)
    static float poisonTimer = 0.0f;
    poisonTimer += dt;
    if (poisonTimer >= 1.0f) {
        if (hero.isPoisoned && hero.hp > 1) hero.hp -= 1;
        poisonTimer = 0.0f;
    }

    // Lógica de Quebra de Postura (Stagger)
    if (hero.isStaggered) {
        hero.staggerTimer -= dt;
        if (hero.staggerTimer <= 0.0f) {
            hero.isStaggered = false;
            hero.posture = hero.maxPosture;
            logMsg = "Voce se recuperou do Stagger!";
        }
    }
    if (enemy.isStaggered) {
        enemy.staggerTimer -= dt;
        if (enemy.staggerTimer <= 0.0f) {
            enemy.isStaggered = false;
            enemy.posture = enemy.maxPosture;
            logMsg = "O inimigo se recuperou do Stagger!";
        }
    }

    if (state == CombatState::RUNNING_ATB) {
        if (!hero.isStaggered) hero.atb += hero.speed * 2.0f * dt;
        if (!enemy.isStaggered) enemy.atb += enemy.speed * 2.0f * dt;

        if (hero.atb >= 100.0f && !hero.isStaggered) {
            hero.atb = 100.0f;
            state = CombatState::WAITING_PLAYER_INPUT;
            logMsg = "Seu Turno: [1] Atk | [2] Def | [3] Pocao | [4] Skill";
        } else if (enemy.atb >= 100.0f && !enemy.isStaggered) {
            enemy.atb = 100.0f;
            state = CombatState::ENEMY_ATTACK_WINDUP;
            windupTimer = 0.0f;
            logMsg = "[ ! ] O INIMIGO VAI ATACAR! Pressione ESPACO para Parry!";
        }
    }
    else if (state == CombatState::WAITING_PLAYER_INPUT) {
        if (IsKeyPressed(KEY_ONE) || IsKeyPressed(KEY_FOUR)) {
            bool isSkill = IsKeyPressed(KEY_FOUR);
            
            if (isSkill && hero.posture < 50) {
                logMsg = "Postura insuficiente para usar a Habilidade!";
                return;
            }
            
            if (isSkill) hero.posture -= 50;
            
            int d20 = GetRandomValue(1, 20);
            hero.atb = 0.0f;
            state = CombatState::RUNNING_ATB;
            
            if (d20 == 1) {
                logMsg = "[D20 = 1] FALHA CRITICA! Voce errou feio!";
            } else {
                int baseDmg = isSkill ? 70 : 35;
                if (d20 == 20) baseDmg *= 2;
                
                enemy.hp -= baseDmg;
                enemy.posture -= (isSkill ? 40 : 15);
                
                if (enemy.posture <= 0) {
                    enemy.isStaggered = true;
                    enemy.staggerTimer = 3.0f;
                    enemy.posture = 0;
                }
                
                if (d20 == 20) {
                    logMsg = "[D20 = 20] CRITICO! -" + std::to_string(baseDmg) + " HP!";
                } else {
                    logMsg = "Voce Atacou! -" + std::to_string(baseDmg) + " HP";
                }
            }
        } 
        else if (IsKeyPressed(KEY_TWO)) {
            hero.atb = 0.0f;
            hero.posture = hero.maxPosture;
            state = CombatState::RUNNING_ATB;
            logMsg = "Voce recuperou toda a sua postura.";
        }
        else if (IsKeyPressed(KEY_THREE)) {
            if (heroPotions > 0) {
                heroPotions--;
                hero.hp += 50;
                hero.isPoisoned = false; // Poção cura veneno!
                if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
                hero.atb = 0.0f;
                state = CombatState::RUNNING_ATB;
                logMsg = "Curou 50 HP e limpou Status! Pocoes: " + std::to_string(heroPotions);
            } else {
                logMsg = "Sem pocoes!";
            }
        }
    }
    else if (state == CombatState::ENEMY_ATTACK_WINDUP) {
        windupTimer += dt;
        
        if (IsKeyPressed(KEY_SPACE)) {
            // Parry Sucesso!
            enemy.atb = 0.0f;
            state = CombatState::RUNNING_ATB;
            logMsg = "* PARRY * Voce defletiu o ataque!";
        } else if (windupTimer >= maxWindupTime) {
            // Falhou em desviar
            enemy.atb = 0.0f;
            state = CombatState::RUNNING_ATB;
            
            int d20 = GetRandomValue(1, 20);
            if (d20 == 1) {
                logMsg = "[D20 = 1] O inimigo errou o ataque!";
            } else {
                int baseDmg = 15;
                if (d20 == 20) baseDmg *= 2;
                
                hero.hp -= baseDmg;
                hero.posture -= 20;
                
                if (GetRandomValue(1, 100) <= 30) {
                    hero.isPoisoned = true;
                }
                
                if (hero.posture <= 0) {
                    hero.isStaggered = true;
                    hero.staggerTimer = 3.0f;
                    hero.posture = 0;
                }
                
                logMsg = enemy.name + " atacou! -" + std::to_string(baseDmg) + " HP";
            }
        }
    }
}

void CombatScreen::Draw(Game* game) {
    ClearBackground(BLACK);
    DrawText("SANCTUARY ENGINE - COMBAT STATE", 10, 10, 20, GOLD);
    DrawText(TextFormat("Pocoes: %d", heroPotions), 10, 40, 20, GREEN);
    if (hero.isPoisoned) DrawText("[ VENENO ]", 10, 70, 20, PURPLE);

    if (state == CombatState::ENEMY_ATTACK_WINDUP) {
        DrawRectangle(0, 0, 800, 600, Fade(RED, 0.3f));
        DrawText("[ ! ]", 350, 150, 50, RED);
    }

    // Desenha Nephalem
    DrawRectangle(100, 250, 100, 150, hero.isStaggered ? GRAY : hero.color);
    DrawText(hero.name.c_str(), 100, 220, 20, RAYWHITE);
    DrawRectangle(100, 420, 100, 20, DARKGRAY);
    DrawRectangle(100, 420, (hero.hp * 100) / hero.maxHp, 20, hero.isPoisoned ? PURPLE : GREEN);
    DrawText(TextFormat("HP: %d/%d", hero.hp, hero.maxHp), 100, 450, 15, RAYWHITE);
    
    DrawRectangle(100, 480, 100, 10, DARKGRAY);
    DrawRectangle(100, 480, hero.atb, 10, YELLOW);
    DrawText("ATB", 100, 495, 10, YELLOW);
    
    DrawRectangle(100, 510, 100, 10, DARKGRAY);
    DrawRectangle(100, 510, hero.posture, 10, ORANGE);
    DrawText("Postura", 100, 525, 10, ORANGE);
    if (hero.isStaggered) DrawText("STAGGERED", 100, 270, 15, RED);

    // Desenha Inimigo
    DrawRectangle(600, 250, 100, 150, enemy.isStaggered ? GRAY : enemy.color);
    DrawText(enemy.name.c_str(), 600, 220, 20, RAYWHITE);
    DrawRectangle(600, 420, 100, 20, DARKGRAY);
    DrawRectangle(600, 420, (enemy.hp * 100) / enemy.maxHp, 20, RED);
    DrawText(TextFormat("HP: %d/%d", enemy.hp, enemy.maxHp), 600, 450, 15, RAYWHITE);

    DrawRectangle(600, 480, 100, 10, DARKGRAY);
    DrawRectangle(600, 480, enemy.atb, 10, YELLOW);
    DrawText("ATB", 600, 495, 10, YELLOW);
    
    DrawRectangle(600, 510, 100, 10, DARKGRAY);
    DrawRectangle(600, 510, enemy.posture, 10, ORANGE);
    DrawText("Postura", 600, 525, 10, ORANGE);
    if (enemy.isStaggered) DrawText("STAGGERED", 600, 270, 15, RED);

    DrawRectangle(250, 500, 300, 50, DARKGRAY);
    DrawText(logMsg.c_str(), 260, 515, 15, RAYWHITE);

    if (enemy.hp <= 0) {
        DrawText("VITORIA!", 340, 300, 40, GREEN);
    } else if (hero.hp <= 0) {
        DrawText("VOCE PERECEU...", 280, 300, 40, RED);
    }
}

void CombatScreen::Exit(Game* game) {
    // Cleanup se precisar
}
