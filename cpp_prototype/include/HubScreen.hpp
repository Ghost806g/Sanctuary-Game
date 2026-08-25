#pragma once
#include "Screen.hpp"
#include <string>
#include <vector>

class HubScreen : public Screen {
private:
    int currentTab;
    std::vector<std::string> tabs;

public:
    void Enter(Game* game) override;
    void Update(Game* game, float dt) override;
    void Draw(Game* game) override;
    void Exit(Game* game) override;
};
