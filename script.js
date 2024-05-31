const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const imagem = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const startPauseContador = document.querySelector('#start-pause');
const pausarEComeçarBt = document.querySelector('#start-pause span');
const pausarEComeçarImg = document.querySelector('.app__card-primary-butto-icon');
const timer = document.querySelector('#timer');
const botoes = document.querySelectorAll('.app__card-button');
const musicaImput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const sonAcionaBt = new Audio('/sons/play.wav');
const sonPausaBt = new Audio('/sons/pause.mp3');
const sonAcabaTemp = new Audio('/sons/beep.mp3');

musica.loop = true;

musicaImput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 1500
    modificaContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 300
    modificaContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 900
    modificaContexto('descanso-longo');
    longoBt.classList.add('active');
});

function modificaContexto(contexto) {
    mostrarTempoNaTela()
    botoes.forEach(function (button) {
        button.classList.remove('active');
    });

    html.setAttribute('data-contexto', contexto);

    imagem.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

const tempoInicialSeg = 2;
let tempoDecorridoSeg = tempoInicialSeg;
let intervaloId = null;

const contagemRegressiva = () => {
    if (tempoDecorridoSeg <= 0) {
        alert('Tempo Esgotado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado')
            document.dispatchEvent(evento) 
        } 
        zerar();
        sonAcabaTemp.play(); 
        return;
    }
    tempoDecorridoSeg -= 1;
    mostrarTempoNaTela()
};

startPauseContador.addEventListener('click', iniciarEPausa);

function iniciarEPausa() {
    if (intervaloId) {
        zerar();
        sonPausaBt.play(); 
        return;
    }
    if (tempoDecorridoSeg <= 0) {
        tempoDecorridoSeg = tempoInicialSeg; 
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
    sonAcionaBt.play(); 
    pausarEComeçarBt.textContent = "Pausar";
    pausarEComeçarImg.setAttribute('src','/imagens/pause.png');
};

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
    pausarEComeçarBt.textContent = "Começar";
    pausarEComeçarImg.setAttribute('src','/imagens/play_arrow.png');
};

function mostrarTempoNaTela () {
    const tempo = new Date (tempoDecorridoSeg * 1000)
    const tempoFromatado = tempo.toLocaleTimeString('pt-Br' , {minute: '2-digit', second: '2-digit'})
    timer.innerHTML = `${tempoFromatado}`    
};

mostrarTempoNaTela();