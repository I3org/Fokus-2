const adicionaTarefaBt = document.querySelector('.app__button--add-task');
const formularioTarefa = document.querySelector('.app__form-add-task');
const formularioTextArea = document.querySelector('.app__form-textarea');
const ulFormularioTarefa = document.querySelector('.app__section-task-list');
const botaoCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')
let tarefaSelecionada = null;
let liTarefaSelecionada = null;
let afazeres = JSON.parse(localStorage.getItem('afazeres')) || [];

function atualizarTarefas() {
    localStorage.setItem('afazeres', JSON.stringify(afazeres));
}

function criarElementoTarefa(tarefaFormulario) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefaFormulario.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novaDescricao = prompt('Insira nova descrição');
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefaFormulario.descricao = novaDescricao;
            atualizarTarefas();
        }
    };

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.appendChild(imagemBotao);

    li.appendChild(svg);
    li.appendChild(paragrafo);
    li.appendChild(botao);

    if (tarefaFormulario.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
        
    }else{
 
        li.onclick = () => {
        document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            });

        if (tarefaSelecionada === tarefaFormulario) {
            paragrafoDescricaoTarefa.textContent = '';
            tarefaSelecionada = null;
            liTarefaSelecionada = null;
        } else {
            tarefaSelecionada = tarefaFormulario;
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefaFormulario.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
        };
    }
    return li;
}

adicionaTarefaBt.addEventListener('click', () => {
    formularioTarefa.classList.toggle('hidden');
});

formularioTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const tarefaFormulario = {
        descricao: formularioTextArea.value
    };

    afazeres.push(tarefaFormulario);

    const elementoTarefa = criarElementoTarefa(tarefaFormulario);
    ulFormularioTarefa.append(elementoTarefa);

    atualizarTarefas();

    formularioTextArea.value = '';

    formularioTarefa.classList.add('hidden');
});

botaoCancelar.addEventListener('click', () => {
    formularioTarefa.classList.add('hidden'); 
    formularioTextArea.value = '';
});

afazeres.forEach(tarefaFormulario => {
    const elementoTarefa = criarElementoTarefa(tarefaFormulario);
    ulFormularioTarefa.append(elementoTarefa);
});


document.addEventListener('DOMContentLoaded', function () {
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefasSalvas.forEach(tarefa => {
        const elementoTarefa = criarElementoTarefa(tarefa);
        ulFormularioTarefa.append(elementoTarefa);
    });
});

document.addEventListener('focoFinalizado', () => {
 if(tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
    liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
    tarefaSelecionada.completa = true
    atualizarTarefas()
 }
})

const removerTarefas = (somenteCompletas) => {
    // const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'

    let seletor  = '.app__section-task-list-item'
    if (somenteCompletas){
        seletor = '.app__section-task-list-item-complete'
    }

    document.querySelectorAll(seletor).forEach (elemento => {
        elemento.remove()
    })
    afazeres = somenteCompletas ? afazeres.filter ( elemento => !elemento.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)

btnRemoverTodas.onclick = () => removerTarefas(false)