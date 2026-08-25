import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Pula direto para a tela de jogo
        this.scene.start('Game');
    }
}
