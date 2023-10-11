document.addEventListener('DOMContentLoaded', function () {
  const btnLogin = document.getElementById('btn-login');
  
  btnLogin.addEventListener('click', function () {
      const login = document.getElementById('login').value;
      const senha = document.getElementById('senha').value;
      
      const data = {
          login,
          senha
      };
      
      fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        if (data.statusCode == 200) {
            localStorage.setItem('funcionario_id', data.funcionario_id);
            // ação de login;
        } else {
            console.log('login ou senha invalidos');
            // açao de não autorizado
        }
        //const teste = localStorage.getItem('funcionario_id');
        //console.log(teste);
      })
      .catch(error => {
          console.error('Erro na requisição:', error);
      });
  });
});