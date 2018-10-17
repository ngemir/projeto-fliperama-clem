/*------ Programado por Emir Takayama ------*/


//======================= Preparação e anotações ================================
/*Antes de tudo transformar em Orientado a Objeto, contendo 4 pilares
Abstração, Encapsulamento, Herança e Polimorfismo
Classes contendo seus construtores, super, e métodos*/
/* De acordo com o engine.js, o fliperama tem 505px de largura e 606px de altura,
cada coluna tem 101px, e cada linha 101px, sendo que temos que considerar que
tem uma simulação de profundidade declarado como -20 por causa do sprite
Entao o gol ficará, não no 0px e sim no -20 px*/

//================ Auxilio de movimento ==============
function positionX(x){ /* Inicia do 0 */
    return x * 101;
}

function positionY(y){
    return y * 80;
}

/*Primeiramente, uma classe mãe que represente todos os personagens, inclusive inimigos*/
class Character {
    constructor(x,y,sprite){ /*todos contém a posição inicial e a sua imagem.*/
        this.x = positionX(x);
        this.y = positionY(y);
        this.sprite = sprite;
    }
// Desenhe os personagens na tela, método exigido pelo jogo
    render(){ /*Método para desenhar personagens na tela, com suas posições*/
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//======================= Inimigo Unitário ====================
// Inimigo que nosso jogador deve evitar
// As variáveis aplicadas a nossas instâncias entram aqui.
// Fornecemos uma a você para que possa começcar.
// A imagem/sprite de nossos inimigos, isso usa um
// ajudante que é fornecido para carregar imagens
// com facilidade.
    /* De acordo com o fliperama, cada inimigo tem sua posição inicial, linha que atuará,
    a sua velocidade de movimento, e claro sua aparência.
    Sendo exclusivo do inimigo, o movimento constante e a linha de atuação*/
class Enemy extends Character{ //O inimigo é um personagem, então ele contém características de um personagem
    constructor(x,y,linha,vel,sprite){ 
        super(x,y,sprite);
        this.y = positionY(linha); //ajusta a linha de atuação
        this.vel = vel;
    }

// Atualize a posição do inimigo, método exigido pelo jogo
// Parâmetro: dt, um delta de tempo entre ticks
// Você deve multiplicar qualquer movimento pelo parâmetro
// dt, o que garantirá que o jogo rode na mesma velocidade
// em qualquer computador.
    /* Atualiza as ações a cada momento do inimigo, caso entrar em colisão com o personagem mostra
    a mensagem de falha e reinicia as posições, se não, vai andando, e se for maior*/
    update(dt) {
        if (this.collision()) {
            alert('Você falhou, mas não desista. Tente novamente pressionando ENTER!');
            player.reset(); /*reseta a posição do jogador*/
            this.reset(); /*reseta a posição do inimigo */
        } else {
            this.x = this.x + this.vel * dt;
            if (this.x >= positionX(5)) { /* Se maior que o próprio fliperama */ 
                this.x = positionX(-1); /* Retornar para esquerda do fliperama, dando um loop */
            }
        }
    }

    collision() {
        return ((this.x + positionX(1) - 50 > player.x && this.x + positionX(1) - 50 < player.x + positionX(1) || this.x >= player.x && this.x < player.x + positionX(1) - 50)) && this.y === player.y;
    }
    //Referência de colisão vindo do https://github.com/mrmauricio/javascript_frogger/blob/master/js/app.js

    reset() {
        this.x = positionX(0);
    }
};


//===================================== Jogador ==========================
// Agora, escreva sua própria classe de jogador
// Esta classe exige um método update(), 
// um render() e um handleInput().
class Player extends Character { /* Contém característica de personagem*/
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.moveX = positionX(1); /*Move exatamente 1 Coluna*/
        this.moveY = positionY(1); /*Move exatamente 1 linha*/
        this.move = '';
    }

    /*Verifica cada movimento do jogador*/
    update() {
        switch (this.move) {
            case 'up': /* Se apertar pra cima, verifica se não vai pra fora do mapa*/
                if(this.y - this.moveY <= positionY(-1))
                    return;
                this.y -= this.moveY; /* Se estiver tudo certo, irá se mover, diminuindo a posição Y para subir */
                break;
            case 'down': /* Se apertar pra baixo, verifica se não vai pra fora do mapa*/
                if(this.y + this.moveY > positionY(5))
                    return;
                this.y += this.moveY;/* Se estiver tudo certo, irá se mover, aumentando a posição Y para descer */
                break;
            case 'right':/* Se apertar pra direita, verifica se não vai pra fora do mapa*/
                if(this.x + this.moveX > positionX(4))
                    return;
                this.x += this.moveX;/* Se estiver tudo certo, irá se mover, aumentando a posição X para ir para direita */
                break;
            case 'left':
                if(this.x - this.moveX < positionX(0)) /* Se apertar pra esquerda, verifica se não vai pra fora do mapa*/
                    return;
                this.x -= this.moveX;/* Se estiver tudo certo, irá se mover, diminuindo a posição X para ir para esquerda */
                break;
            default: /* Prevenção de outros comandos, para fazer nada*/
                break;
        }
    
        if (this.y == positionY(0)) { /*Aqui é a posição do gol*/
            alert('Você conseguiu, Parabéns!');
            this.reset(); /* Reinicia tudo */
        }
    
        this.move = '';
    }

    
    reset() {
        this.x = positionX(2);
        this.y = positionY(5);
    }

    handleInput(mov) {
        this.move = mov;
    }
}

//============================== Instância de Objetos ==========================
// Represente seus objetos como instâncias.
// Coloque todos os objetos inimgos numa array allEnemies
// Coloque o objeto do jogador numa variável chamada jogador.
/* Jogador instanciado com posição inicial x, pos. y, e imagem */
let player = new Player(2, 5, 'images/operator.png'); 
let allEnemies = /* Array de Todos os inimigos,
contendo, posição inicial x, pos. y, linha de atuação, velocidade e imagens  */
[ 
    new Enemy(0, undefined, 1, 250, 'images/clem.png'),
    new Enemy(0, undefined, 1, 500, 'images/clem.png'),
    new Enemy(0, undefined, 2, 100, 'images/clem.png'),
    new Enemy(0, undefined, 2, 200, 'images/clem.png'),
    new Enemy(0, undefined, 3, 20, 'images/clem.png'),
    new Enemy(0, undefined, 3, 50, 'images/clem.png')
];



//================================ Reconhecimento de Eventos =========================
// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
