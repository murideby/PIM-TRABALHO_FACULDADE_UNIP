const cronometro = document.getElementById("cronometro");
const startStopButton = document.getElementById("startStop");
const funcionarioId = localStorage.getItem("funcionario_id");

const horarioInicio = "2023-10-14T23:03:50.700+00:00";
const horarioFim = "2023-10-14T23:45:30.500+00:00";

let statusBotao = 1;
let intervalId;
let horaEntrada;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await obterRegistroPonto();

        if (res) {
            const { dados } = res;
            if (dados === null) {
                statusBotao = 1;
            } else if (dados.hora_saida === null) {
                statusBotao = 2;
                horaEntrada = new Date(dados.hora_entrada);
                iniciarContador();
            } else {
                statusBotao = 3;
                pararContador();
                const diferenca = calcularDiferencaDeHorario(dados.hora_entrada, dados.hora_saida);
                cronometro.innerText = diferenca;
            }

            atualizarBotao(statusBotao);
        } else {
            redirecionarParaErro();
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        redirecionarParaErro();
    }
});

startStopButton.addEventListener('click', async () => {
    try {
        const data = await realizarAcaoPonto(funcionarioId);
        if (data.statusCode === 201) {
            statusBotao = 2;
            horaEntrada = Date.now();
            iniciarContador();
        } else if (data.statusCode === 200) {
            statusBotao = 3;
            pararContador();
        }
        atualizarBotao(statusBotao);
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

function obterRegistroPonto() {
    return fetch(`http://localhost:8080/ponto?id=${funcionarioId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => (response.ok ? response.json() : Promise.reject(`Erro na requisição: ${response.status}`)));
}

function realizarAcaoPonto(idFuncionario) {
    return fetch('http://localhost:8080/ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_funcionario: idFuncionario })
    })
    .then(response => (response.ok ? response.json() : Promise.reject(`Erro na requisição: ${response.status}`)));
}

function formatarNumero(numero) {
    return numero.toString().padStart(2, '0');
}

function atualizarContador() {
    const agora = new Date();
    const diferencaEmMilissegundos = agora - horaEntrada;
    const segundos = Math.floor(diferencaEmMilissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    const segundosFormatados = formatarNumero(segundos % 60);
    const minutosFormatados = formatarNumero(minutos % 60);
    const horasFormatadas = formatarNumero(horas);

    cronometro.innerText = `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
}

function iniciarContador() {
    intervalId = setInterval(atualizarContador, 1000);
}

function pararContador() {
    clearInterval(intervalId);
}

const atualizarBotao = (statusBotao) => {
    const textos = ["Registrar Entrada", "Registrar Saída", "Registrado!"];
    startStopButton.innerText = textos[statusBotao - 1];
};

const calcularDiferencaDeHorario = (horaInicio, horaFim) => {
    const dataInicio = new Date(horaInicio);
    const dataFim = new Date(horaFim);
  
    const diferencaEmMilissegundos = dataFim - dataInicio;
    const diferencaEmSegundos = Math.floor(diferencaEmMilissegundos / 1000);
  
    const horas = Math.floor(diferencaEmSegundos / 3600);
    const minutos = Math.floor((diferencaEmSegundos % 3600) / 60);
    const segundos = diferencaEmSegundos % 60;
  
    const formatoHora = `${formatarNumero(horas)}:${formatarNumero(minutos)}:${formatarNumero(segundos)}`;
    return formatoHora;
  }