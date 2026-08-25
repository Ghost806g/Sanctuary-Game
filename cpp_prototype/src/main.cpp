#include "Game.hpp"
#include "TitleScreen.hpp"

int main(void) {
    Game game(800, 600, "Sanctuary Engine - C++ Native");
    game.ChangeScreen(std::make_unique<TitleScreen>());
    game.Run();
    return 0;
}
