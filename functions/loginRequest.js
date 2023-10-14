document.addEventListener('DOMContentLoaded', function () {
    const btnLogin = document.getElementById('btn-login');
    const loginInput = document.getElementById('login');
    const senhaInput = document.getElementById('senha');
    const credentialAlert = document.getElementById('alerta');
    
    btnLogin.addEventListener('click', async function () {
      const login = loginInput.value;
      const senha = senhaInput.value;
  
      credentialAlert.style.display = 'none';
  
      try {
        const data = { login, senha };
        
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.statusCode === 200) {
            localStorage.setItem('funcionario_id', responseData.funcionario_id);
            window.location.href = './holerite.html';
        } else {
            credentialAlert.style.display = 'block';
        }
      } catch (error) {
            console.error('Erro na requisição:', error);
      }
    });
  });  