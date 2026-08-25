import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#1a0505');

        this.add.text(512, 50, 'Exploração e Combate', {
            fontFamily: 'Cinzel', fontSize: 24, color: '#fbbf24',
            align: 'center'
        }).setOrigin(0.5);

        // Um sprite placeholder para o Herói (podemos carregar imagem depois)
        const heroSprite = this.add.rectangle(300, 450, 50, 100, 0x3b82f6);
        
        // Placeholder para o Inimigo, que será substituído pela imagem
        let enemySprite = this.add.rectangle(700, 450, 80, 80, 0xef4444);
        let enemyNameText = this.add.text(700, 250, 'Aguardando Combate...', {
            fontFamily: 'Cinzel', fontSize: 20, color: '#ffffff'
        }).setOrigin(0.5);

        if (window.PhaserBridge) {
            window.PhaserBridge.on('iniciar-combate', (data) => {
                enemyNameText.setText(data.name);
                if (data.color) {
                    enemyNameText.setColor(data.color);
                }

                if (data.img) {
                    // Carrega a imagem dinamicamente
                    const imgKey = 'enemy_' + data.name.replace(/[^a-zA-Z0-9]/g, '');
                    
                    // Se já existe no cache, usa direto
                    if (this.textures.exists(imgKey)) {
                        enemySprite.destroy();
                        enemySprite = this.add.image(700, 450, imgKey);
                        enemySprite.setScale(0.8);
                    } else {
                        this.load.image(imgKey, '/' + data.img);
                        this.load.once('complete', () => {
                            if (enemySprite) enemySprite.destroy();
                            enemySprite = this.add.image(700, 450, imgKey);
                            enemySprite.setScale(0.8);
                        });
                        this.load.start();
                    }
                }
            });

            window.PhaserBridge.on('ataque-jogador', (dano) => {
                this.tweens.add({
                    targets: heroSprite,
                    x: 400,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        // Pisca o inimigo (funciona para image ou rectangle)
                        enemySprite.setTintFill(0xffffff);
                        this.time.delayedCall(100, () => {
                            enemySprite.clearTint();
                        });

                        const dmgText = this.add.text(700, 400, `-${dano}`, {
                            fontFamily: 'Arial Black', fontSize: 30, color: '#ff0000',
                            stroke: '#ffffff', strokeThickness: 4
                        }).setOrigin(0.5);

                        this.tweens.add({
                            targets: dmgText,
                            y: 300,
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => dmgText.destroy()
                        });
                    }
                });
            });
        }
    }
}
