#pragma once

class Game;

class Screen {
public:
    virtual ~Screen() = default;
    
    // Chamado quando a tela iniciar
    virtual void Enter(Game* game) = 0;
    
    // Loop de logica
    virtual void Update(Game* game, float dt) = 0;
    
    // Loop de desenho
    virtual void Draw(Game* game) = 0;
    
    // Chamado quando a tela for fechada
    virtual void Exit(Game* game) = 0;
};
