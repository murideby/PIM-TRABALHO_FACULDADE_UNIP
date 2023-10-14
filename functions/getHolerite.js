document.addEventListener('DOMContentLoaded', () => {
    const funcionario_id = localStorage.getItem("funcionario_id");
    const botao = document.getElementById('btn-holerite');
    const holerite = document.getElementById('holerite');
    const tbody = holerite.querySelector('tbody');
    const mesList = document.getElementById('meses');
    
    botao.addEventListener('click', () => {
        const mes = mesList.value;
        tbody.innerHTML = "";
        
        if (funcionario_id != 'null') {
            fetch(`http://localhost:8080/holerite?id=${funcionario_id}&mes=${mes}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                const { holerites } = data;
                
                if (!holerites) return 0;

                holerites.forEach((h) => {
                    const salarioBruto = calcularSalario(h.total_horas, h.valor_hora);
                    const desconto = calcularDescontos(salarioBruto, h.plano);
                    const salario = salarioBruto - desconto;

                    const row = document.createElement('tr');

                    const nome = document.createElement('td');
                    nome.textContent = h.nome_completo;
                    row.appendChild(nome);

                    const cargo = document.createElement('td');
                    cargo.textContent = h.nome_cargo;
                    row.appendChild(cargo);

                    const salarioBase = document.createElement('td');
                    salarioBase.textContent = "R$ " + salarioBruto;
                    row.appendChild(salarioBase);

                    const descontos = document.createElement('td');
                    descontos.textContent = "R$ " + desconto;
                    row.appendChild(descontos);

                    const salarioLiquido = document.createElement('td');
                    salarioLiquido.textContent = "R$ " + salario;
                    row.appendChild(salarioLiquido);

                    const dataPagamento = document.createElement('td');
                    dataPagamento.textContent = getDataPagamento(h.mes_referente);
                    row.appendChild(dataPagamento);

                    tbody.appendChild(row);
                })
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        } else {
            window.location.href = './error.html';
        } 
    });
});

const calcularSalario = (horasTrabalhadas, valorHora) => {
  return horasTrabalhadas * valorHora;
};

const getDataPagamento = (mes_referente) => {
  const data = new Date();
  let dia = 1;
  let mes = parseInt(mes_referente) + 1; 
  let ano = data.getFullYear();

  if (mes === 13) {
    mes = 1;
    ano++;
  }

  if (dia < 10) {
    dia = "0" + dia;
  }

  if (mes < 10) {
    mes = "0" + mes;
  }

  const dataFormatada = dia + "/" + mes + "/" + ano;
  return dataFormatada;
};

const calcularDescontos = (salarioBruto, plano) => {
  const calcularImpostoRenda = (salarioBruto) => {
    let impostoRenda = 0;
  
    if (salarioBruto <= 1903.98) {
      impostoRenda = 0;
    } else if (salarioBruto <= 2826.65) {
      impostoRenda = salarioBruto * 0.075;
    } else if (salarioBruto <= 3751.05) {
      impostoRenda = salarioBruto * 0.15;
    } else if (salarioBruto <= 4664.68) {
      impostoRenda = salarioBruto * 0.225;
    } else {
      impostoRenda = salarioBruto * 0.275;
    }
  
    return impostoRenda;
  };
  
  const calcularPrevidencia = (salarioBruto) => salarioBruto * 0.10;
  const calcularFundoPensao = (salarioBruto) => salarioBruto * 0.03;
  const calcularSeguroVida = (salarioBruto) => salarioBruto * 0.02;
  const calcularPlanoSaude = (salarioBruto) => salarioBruto * 0.05;

  const descontoImpostoRenda = calcularImpostoRenda(salarioBruto);

  const descontoPrevidencia = calcularPrevidencia(salarioBruto);

  const descontoFundoPensao = calcularFundoPensao(salarioBruto);

  const descontoSeguroVida = calcularSeguroVida(salarioBruto);

  const descontoPlanoSaude = plano ? calcularPlanoSaude(salarioBruto) : 0;

  const totalDescontos = descontoImpostoRenda + descontoPrevidencia + descontoFundoPensao + descontoSeguroVida + descontoPlanoSaude;

  return totalDescontos;
};