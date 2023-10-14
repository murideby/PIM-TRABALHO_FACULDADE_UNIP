document.addEventListener('DOMContentLoaded', async () => {
    const funcionarioId = localStorage.getItem("funcionario_id");
    const nomeElement = document.getElementById('span');
    const idElement = document.getElementById('span2');

    try {
        if (funcionarioId !== 'null') {
            const response = await fetch(`http://localhost:8080/funcionario?id=${funcionarioId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const nomeCompleto = data.funcionario.nome_completo;

                nomeElement.textContent = nomeCompleto;
                idElement.textContent = funcionarioId;
            } else {
                console.error('Erro na requisição:', response.status);
                redirecionarParaErro();
            }
        } else {
            redirecionarParaErro();
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        redirecionarParaErro();
    }
});

function redirecionarParaErro() {
    window.location.href = './error.html';
}