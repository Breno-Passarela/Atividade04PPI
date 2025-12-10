import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  session({
    secret: "f1Pp0fL3gEnd$",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
  })
);

function verificarLogin(req, res, next) {
  if (!req.session.user && req.path !== "/login") {
    return res.redirect("/login");
  }

  next();
}

app.use(verificarLogin);

let jogadores = [];
let equipes = [];

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/home");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login - FIPP Of Legends</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

        <style>
            body {
                background: #0e0e0e;
                font-family: "Segoe UI", sans-serif;
            }

            .container-login {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                padding: 20px;
                gap: 30px;
            }

            .trophy-img {
                width: 390px;
                margin-right: -60px;
                z-index: 2;
            }

            .login-box {
                width: 420px;
                border: 2px solid #e6e6e6;
                border-left: 0px;
                border-radius: 20px;
                padding: 30px;
                color: white;
                text-align: center;
                position: relative;
                z-index: 1;
            }

            .login-title {
                font-size: 2rem;
                font-weight: 700;
                color: white;
            }

            .login-subtitle {
                margin-top: -10px;
                color: #ccc;
            }

            .login-form-bg {
                width: 100%;
                background: #1111115b;
                border-radius: 20px;
                padding: 25px;
                margin-top: 25px;
                border: 1px solid #333;
            }

            .form-control {
                background: transparent;
                border: 1px solid #444;
                color: white;
            }
            .form-control:focus {
                background: transparent;
                color: white;
                border-color: #888;
                box-shadow: none;
            }

            .btn-login {
                width: 100%;
                background-color: #1a1a1a;
                border: 1px solid #444;
                color: #e6e6e6;
                border-radius: 8px;
                margin-top: 10px;
            }
            .btn-login:hover {
                background-color: #333;
                color: white;
            }
        </style>
    </head>

    <body>
        <div class="container-login">

            <img src="/Trophy.png" alt="Troféu" class="trophy-img">

            <div class="login-box">
                <h1 class="login-title">FIPP Of Legends</h1>
                <p class="login-subtitle">Login</p>

                <div class="login-form-bg">
                    <form method="POST" action="/login">

                        <div class="mb-3 text-start">
                            <label class="form-label">Usuário</label>
                            <input type="text" name="username" class="form-control">
                        </div>

                        <div class="mb-3 text-start">
                            <label class="form-label">Senha</label>
                            <input type="password" name="password" class="form-control">
                        </div>

                        <button type="submit" class="btn btn-login">Entrar</button>

                    </form>
                </div>
            </div>

        </div>
    </body>
    </html>
    `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    req.session.user = {
      nome: "Administrador",
      login: username
    };

    res.cookie("ultimoAcesso", new Date().toLocaleString());
    return res.redirect("/home");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login - FIPP Of Legends</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          <style>
              body {
                  background: #0e0e0e;
                  font-family: "Segoe UI", sans-serif;
              }

              .container-login {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  padding: 20px;
                  gap: 30px;
              }

              .trophy-img {
                  width: 390px;
                  margin-right: -60px;
                  z-index: 2;
              }

              .login-box {
                  width: 420px;
                  border: 2px solid #e6e6e6;
                  border-left: 0px;
                  border-radius: 20px;
                  padding: 30px;
                  color: white;
                  text-align: center;
                  position: relative;
                  z-index: 1;
              }

              .login-title {
                  font-size: 2rem;
                  font-weight: 700;
                  color: white;
              }

              .login-subtitle {
                  margin-top: -10px;
                  color: #ccc;
              }

              .login-form-bg {
                  width: 100%;
                  background: #1111115b;
                  border-radius: 20px;
                  padding: 25px;
                  margin-top: 25px;
                  border: 1px solid #333;
              }

              .form-control {
                  background: transparent;
                  border: 1px solid #444;
                  color: white;
              }
              .form-control:focus {
                  background: transparent;
                  color: white;
                  border-color: #888;
                  box-shadow: none;
              }

              .btn-login {
                  width: 100%;
                  background-color: #1a1a1a;
                  border: 1px solid #444;
                  color: #e6e6e6;
                  border-radius: 8px;
                  margin-top: 10px;
              }
              .btn-login:hover {
                  background-color: #333;
                  color: white;
              }
              
              .alert {
                  background-color: #f8d7da;
                  color: #721c24;
                  border: 1px solid #f5c6cb;
                  padding: 12px;
                  margin-bottom: 20px;
                  border-radius: 8px;
                  font-size: 0.95rem;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container-login">
              <img src="/Trophy.png" alt="Troféu" class="trophy-img">

              <div class="login-box">
                  <h1 class="login-title">FIPP Of Legends</h1>
                  <p class="login-subtitle">Login</p>

                  <div class="login-form-bg">
                      <div class="alert">Usuário ou senha incorretos.</div>
                      <form method="POST" action="/login">
                          <div class="mb-3 text-start">
                              <label class="form-label">Usuário</label>
                              <input type="text" name="username" class="form-control" value="${username || ''}">
                          </div>

                          <div class="mb-3 text-start">
                              <label class="form-label">Senha</label>
                              <input type="password" name="password" class="form-control">
                          </div>

                          <button type="submit" class="btn btn-login">Entrar</button>
                      </form>
                  </div>
              </div>
          </div>
      </body>
      </html>
  `);
});

app.get("/home", (req, res) => {
    const usuario = req.session.user?.nome;
    const ultimoAcesso = req.cookies.ultimoAcesso;

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Home - FIPP of Legends</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
            body {
                background: #0e0e0e;
                color: #e6e6e6;
                font-family: "Segoe UI", sans-serif;
                margin: 0;
                padding: 0;
            }

            .navbar {
                background-color: #0e0e0e !important;
                border-bottom: 1px solid #444;
                padding: 10px 30px;
            }

            .navbar-text {
                font-size: 1.5rem;
                font-weight: bold;
                color: white !important;
            }

            .logo {
                width: 40px;
                height: 40px;
            }

            .welcome-text {
                color: #ccc;
                font-size: 0.9rem;
                margin-right: 20px;
            }

            .dropdown-menu {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
            }

            .dropdown-menu .dropdown-item {
                color: #e6e6e6 !important;
            }

            .dropdown-menu .dropdown-item:hover {
                background-color: #333 !important;
                color: white !important;
            }

            .main-container {
                display: flex;
                padding: 40px;
                gap: 50px;
                max-width: 1400px;
                margin: 0 auto;
            }

            .image-side {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .character-image {
                width: 100%;
                max-width: 350px;
                height: 500px;
                background: url('/Pyke.png') no-repeat center center;
                background-size: contain;
                border-radius: 10px;
            }

            .content-side {
                flex: 2;
                padding-right: 40px;
            }

            .welcome-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: white;
                margin-bottom: 10px;
                text-align: center;
            }

            .system-title {
                font-size: 3rem;
                font-weight: 800;
                color: white;
                margin-bottom: 30px;
                text-align: center;
            }

            .description {
                color: #ccc;
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 60px;
                text-align: center;
            }

            .cards-container {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }

            .card-section {
                margin-bottom: 30px;
            }

            .card-title {
                font-size: 1.3rem;
                font-weight: 600;
                color: #e6e6e6;
                margin-bottom: 15px;
            }

            .card-description {
                color: #aaa;
                font-size: 0.95rem;
                margin-bottom: 15px;
                line-height: 1.4;
            }

            .buttons-container {
                display: flex;
                gap: 15px;
            }

            .card-button {
                flex: 1;
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid #444;
                border-radius: 6px;
                padding: 10px 20px;
                text-decoration: none;
                text-align: center;
                font-weight: 500;
                transition: all 0.2s;
            }

            .card-button:hover {
                background-color: #333;
                color: white;
                border-color: #666;
                text-decoration: none;
            }
        </style>
    </head>

    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <span class="navbar-brand fw-bold">Home</span>
                <div class="mx-auto d-flex align-items-center gap-2">
                    <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                    <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                    
                    <div class="btn-group dropstart">
                        <button
                            type="button"
                            class="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            ${usuario}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="main-container">
            <div class="image-side">
                <div class="character-image"></div>
            </div>

            <div class="content-side">
                <h1 class="welcome-title">Bem-vindo ao sistema</h1>
                <h2 class="system-title">FIPP Of Legends</h2>
                
                <p class="description">
                    Organize equipes, cadastre jogadores e administre o campeonato amador de League of Legends.
                </p>

                <div class="cards-container">
                    <div class="card-section">
                        <h3 class="card-title">Cadastro de jogadores</h3>
                        <p class="card-description">
                            Jogadores participantes das equipes do campeonato e suas respectivas funções.
                        </p>
                        <div class="buttons-container">
                            <a href="/jogadores/cadastrar" class="card-button">Cadastrar</a>
                            <a href="/jogadores" class="card-button">Exibir</a>
                        </div>
                    </div>

                    <div class="card-section">
                        <h3 class="card-title">Cadastro de equipes</h3>
                        <p class="card-description">
                            Equipes participantes do campeonato e seus respectivos líderes.
                        </p>
                        <div class="buttons-container">
                            <a href="/equipes/cadastrar" class="card-button">Cadastrar</a>
                            <a href="/equipes" class="card-button">Exibir</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.send(html);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/jogadores/cadastrar", (req, res) => {
    const usuario = req.session.user?.nome;
    const ultimoAcesso = req.cookies.ultimoAcesso;
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastrar Jogador - FIPP Of Legends</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background: #0e0e0e;
                color: #e6e6e6;
                font-family: "Segoe UI", sans-serif;
                margin: 0;
                padding: 0;
            }

            .navbar {
                background-color: #0e0e0e !important;
                border-bottom: 1px solid #444;
                padding: 10px 30px;
            }

            .navbar-text {
                font-size: 1.5rem;
                font-weight: bold;
                color: white !important;
            }

            .logo {
                width: 40px;
                height: 40px;
            }

            .dropdown-menu {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
            }

            .dropdown-menu .dropdown-item {
                color: #e6e6e6 !important;
            }

            .dropdown-menu .dropdown-item:hover {
                background-color: #333 !important;
                color: white !important;
            }

            .form-container {
                max-width: 800px;
                margin: 30px auto;
                padding: 30px;
                background: #1a1a1a;
                border-radius: 10px;
                border: 1px solid #444;
            }

            .form-title {
                color: white;
                margin-bottom: 30px;
                text-align: center;
                border-bottom: 1px solid #444;
                padding-bottom: 15px;
            }

            .form-label {
                color: #e6e6e6;
                font-weight: 500;
            }

            .form-control, .form-select {
                background-color: #2a2a2a;
                border: 1px solid #444;
                color: #e6e6e6;
                padding: 10px;
            }

            .form-control:focus, .form-select:focus {
                background-color: #2a2a2a;
                border-color: #666;
                color: #e6e6e6;
                box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
            }

            .btn-submit {
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 30px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .btn-submit:hover {
                background-color: #333;
                color: white;
                border-color: #666;
            }

            .btn-back {
                background-color: #2a2a2a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                transition: all 0.2s;
            }

            .btn-back:hover {
                background-color: #333;
                color: white;
                text-decoration: none;
            }

            .text-danger {
                color: #ff6b6b;
                font-size: 0.875rem;
                margin-top: 5px;
            }

            .welcome-text {
                color: #ccc;
                font-size: 0.9rem;
                margin-right: 20px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <span class="navbar-brand fw-bold">Cadastro de Jogadores</span>
                <div class="mx-auto d-flex align-items-center gap-2">
                    <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                    <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                    
                    <div class="btn-group dropstart">
                        <button
                            type="button"
                            class="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            ${usuario}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container">
            <div class="form-container">
                <h2 class="form-title">Cadastrar Novo Jogador</h2>
                
                <form action="/jogadores/cadastrar" method="POST">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Nome do Jogador *</label>
                            <input type="text" name="nome" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Nickname in-game *</label>
                            <input type="text" name="nickname" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Função (Posição) *</label>
                            <select name="funcao" class="form-select">
                                <option value="" class="dropdown-item disabled" aria-disabled="true">Selecione uma função</option>
                                <option value="top">Top</option>
                                <option value="jungle">Jungle</option>
                                <option value="mid">Mid</option>
                                <option value="atirador">Atirador</option>
                                <option value="suporte">Suporte</option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Elo *</label>
                            <select name="elo" class="form-select">
                                <option value="" class="dropdown-item disabled" aria-disabled="true">Selecione um elo</option>
                                <option value="Ferro">Ferro</option>
                                <option value="Bronze">Bronze</option>
                                <option value="Prata">Prata</option>
                                <option value="Ouro">Ouro</option>
                                <option value="Platina">Platina</option>
                                <option value="Diamante">Diamante</option>
                                <option value="Mestre">Mestre</option>
                                <option value="Grão-Mestre">Grão-Mestre</option>
                                <option value="Desafiante">Desafiante</option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Gênero *</label>
                            <select name="genero" class="form-select">
                                <option value="" class="dropdown-item disabled" aria-disabled="true">Selecione um gênero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                                <option value="Prefiro não informar">Prefiro não informar</option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Equipe *</label>
                            <select name="equipe" class="form-select">
                                <option value="" class="dropdown-item disabled" aria-disabled="true">Selecione uma equipe</option>
                                ${equipes.map(equipe => `
                                    <option value="${equipe.nome}">${equipe.nome}</option>
                                `).join('')}
                                <option value="Sem equipe">Sem equipe</option>
                            </select>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-12 d-flex justify-content-between">
                            <div class="col-md-6">
                                <a href="/home" class="btn btn-back">Voltar para Home</a>
                                <a href="/jogadores" class="btn btn-back">Voltar para Lista</a>
                            </div>

                            <button type="submit" class="btn btn-submit">Cadastrar Jogador</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;
    
    res.send(html);
});

app.post("/jogadores/cadastrar", (req, res) => {
    const { nome, nickname, funcao, elo, genero, equipe } = req.body;
    
    let erroNome = !nome ? "O campo Nome do Jogador é obrigatório." : "";
    let erroNickname = !nickname ? "O campo Nickname in-game é obrigatório." : "";
    let erroFuncao = !funcao ? "O campo Função é obrigatório." : "";
    let erroElo = !elo ? "O campo Elo é obrigatório." : "";
    let erroGenero = !genero ? "O campo Gênero é obrigatório." : "";
    let erroEquipe = !equipe ? "O campo Equipe é obrigatório." : "";

    if (erroNome || erroNickname || erroFuncao || erroElo || erroGenero || erroEquipe) {
        const usuario = req.session.user?.nome;
        const ultimoAcesso = req.cookies.ultimoAcesso;
        
        const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastrar Jogador - FIPP Of Legends</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background: #0e0e0e;
                    color: #e6e6e6;
                    font-family: "Segoe UI", sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .navbar {
                    background-color: #0e0e0e !important;
                    border-bottom: 1px solid #444;
                    padding: 10px 30px;
                }

                .navbar-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white !important;
                }

                .logo {
                    width: 40px;
                    height: 40px;
                }

                .dropdown-menu {
                    background-color: #1a1a1a !important;
                    border: 1px solid #444 !important;
                }

                .dropdown-menu .dropdown-item {
                    color: #e6e6e6 !important;
                }

                .dropdown-menu .dropdown-item:hover {
                    background-color: #333 !important;
                    color: white !important;
                }

                .form-container {
                    max-width: 800px;
                    margin: 30px auto;
                    padding: 30px;
                    background: #1a1a1a;
                    border-radius: 10px;
                    border: 1px solid #444;
                }

                .form-title {
                    color: white;
                    margin-bottom: 30px;
                    text-align: center;
                    border-bottom: 1px solid #444;
                    padding-bottom: 15px;
                }

                .form-label {
                    color: #e6e6e6;
                    font-weight: 500;
                }

                .form-control, .form-select {
                    background-color: #2a2a2a;
                    border: 1px solid #444;
                    color: #e6e6e6;
                    padding: 10px;
                }

                .form-control:focus, .form-select:focus {
                    background-color: #2a2a2a;
                    border-color: #666;
                    color: #e6e6e6;
                    box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
                }

                .btn-submit {
                    background-color: #1a1a1a;
                    color: #e6e6e6;
                    border: 1px solid #444;
                    padding: 10px 30px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .btn-submit:hover {
                    background-color: #333;
                    color: white;
                    border-color: #666;
                }

                .btn-back {
                    background-color: #2a2a2a;
                    color: #e6e6e6;
                    border: 1px solid #444;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: all 0.2s;
                }

                .btn-back:hover {
                    background-color: #333;
                    color: white;
                    text-decoration: none;
                }

                .text-danger {
                    color: #ff6b6b;
                    font-size: 0.875rem;
                    margin-top: 5px;
                }

                .welcome-text {
                    color: #ccc;
                    font-size: 0.9rem;
                    margin-right: 20px;
                }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <div class="container-fluid">
                    <span class="navbar-brand fw-bold">Cadastro de Jogadores</span>
                    <div class="mx-auto d-flex align-items-center gap-2">
                        <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                        <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                    </div>

                    <div class="d-flex align-items-center">
                        <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                        
                        <div class="btn-group dropstart">
                            <button
                                type="button"
                                class="btn btn-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                ${usuario}
                            </button>

                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="container">
                <div class="form-container">
                    <h2 class="form-title">Cadastrar Novo Jogador</h2>
                    
                    <form action="/jogadores/cadastrar" method="POST">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nome do Jogador *</label>
                                <input type="text" name="nome" class="form-control" value="${nome || ""}">
                                ${erroNome ? `<p class="text-danger">${erroNome}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Nickname in-game *</label>
                                <input type="text" name="nickname" class="form-control" value="${nickname || ""}">
                                ${erroNickname ? `<p class="text-danger">${erroNickname}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Função (Posição) *</label>
                                <select name="funcao" class="form-select">
                                    <option value="">Selecione uma função</option>
                                    <option value="top" ${funcao === 'top' ? 'selected' : ''}>Top</option>
                                    <option value="jungle" ${funcao === 'jungle' ? 'selected' : ''}>Jungle</option>
                                    <option value="mid" ${funcao === 'mid' ? 'selected' : ''}>Mid</option>
                                    <option value="atirador" ${funcao === 'atirador' ? 'selected' : ''}>Atirador</option>
                                    <option value="suporte" ${funcao === 'suporte' ? 'selected' : ''}>Suporte</option>
                                </select>
                                ${erroFuncao ? `<p class="text-danger">${erroFuncao}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Elo *</label>
                                <select name="elo" class="form-select">
                                    <option value="">Selecione um elo</option>
                                    <option value="Ferro" ${elo === 'Ferro' ? 'selected' : ''}>Ferro</option>
                                    <option value="Bronze" ${elo === 'Bronze' ? 'selected' : ''}>Bronze</option>
                                    <option value="Prata" ${elo === 'Prata' ? 'selected' : ''}>Prata</option>
                                    <option value="Ouro" ${elo === 'Ouro' ? 'selected' : ''}>Ouro</option>
                                    <option value="Platina" ${elo === 'Platina' ? 'selected' : ''}>Platina</option>
                                    <option value="Diamante" ${elo === 'Diamante' ? 'selected' : ''}>Diamante</option>
                                    <option value="Mestre" ${elo === 'Mestre' ? 'selected' : ''}>Mestre</option>
                                    <option value="Grão-Mestre" ${elo === 'Grão-Mestre' ? 'selected' : ''}>Grão-Mestre</option>
                                    <option value="Desafiante" ${elo === 'Desafiante' ? 'selected' : ''}>Desafiante</option>
                                </select>
                                ${erroElo ? `<p class="text-danger">${erroElo}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Gênero *</label>
                                <select name="genero" class="form-select">
                                    <option value="">Selecione um gênero</option>
                                    <option value="Masculino" ${genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                                    <option value="Feminino" ${genero === 'Feminino' ? 'selected' : ''}>Feminino</option>
                                    <option value="Outro" ${genero === 'Outro' ? 'selected' : ''}>Outro</option>
                                    <option value="Prefiro não informar" ${genero === 'Prefiro não informar' ? 'selected' : ''}>Prefiro não informar</option>
                                </select>
                                ${erroGenero ? `<p class="text-danger">${erroGenero}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Equipe *</label>
                                <select name="equipe" class="form-select">
                                    <option value="">Selecione uma equipe</option>
                                    ${equipes.map(equipeItem => `
                                        <option value="${equipeItem.nome}" ${equipe === equipeItem.nome ? 'selected' : ''}>${equipeItem.nome}</option>
                                    `).join('')}
                                    <option value="Sem equipe" ${equipe === 'Sem equipe' ? 'selected' : ''}>Sem equipe</option>
                                </select>
                                ${erroEquipe ? `<p class="text-danger">${erroEquipe}</p>` : ""}
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-12 d-flex justify-content-between">
                                <div class="col-md-6">
                                    <a href="/home" class="btn btn-back">Voltar para Home</a>
                                    <a href="/jogadores" class="btn btn-back">Voltar para Lista</a>
                                </div>

                                <button type="submit" class="btn btn-submit">Cadastrar Jogador</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `;
        
        return res.send(html);
    }
    
    const novoJogador = {
        id: jogadores.length + 1,
        nome,
        nickname,
        funcao,
        elo,
        genero,
        equipe,
        dataCadastro: new Date().toLocaleString()
    };
    
    jogadores.push(novoJogador);
    res.redirect("/jogadores");
});

app.get("/jogadores", (req, res) => {
    const usuario = req.session.user?.nome;
    const ultimoAcesso = req.cookies.ultimoAcesso;
    
    const filtroEquipe = req.query.equipe || "";
    
    let jogadoresFiltrados = jogadores;
    if (filtroEquipe) {
        jogadoresFiltrados = jogadores.filter(j => j.equipe === filtroEquipe);
    }
    
    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lista de Jogadores - FIPP Of Legends</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background: #0e0e0e;
                color: #e6e6e6;
                font-family: "Segoe UI", sans-serif;
            }

            .navbar {
                background-color: #0e0e0e !important;
                border-bottom: 1px solid #444;
                padding: 10px 30px;
            }

            .navbar-text {
                font-size: 1.5rem;
                font-weight: bold;
                color: white !important;
            }

            .container-custom {
                max-width: 1200px;
                margin: 30px auto;
                padding: 20px;
            }

            .page-title {
                color: white;
                margin-bottom: 30px;
                text-align: center;
            }

            .btn-cadastrar {
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                transition: all 0.2s;
            }

            .btn-cadastrar:hover {
                background-color: #333;
                color: white;
                text-decoration: none;
            }

            .table-dark {
                background-color: #1a1a1a;
                border: 1px solid #444;
            }

            .table-dark th {
                background-color: #2a2a2a;
                border-color: #444;
                color: #e6e6e6;
            }

            .table-dark td {
                border-color: #444;
                color: #ddd;
            }

            .badge {
                font-size: 0.85em;
                padding: 5px 10px;
            }

            .badge-top { background-color: #4a90e2; }
            .badge-jungle { background-color: #50e3c2; }
            .badge-mid { background-color: #f5a623; }
            .badge-atirador { background-color: #d0021b; }
            .badge-suporte { background-color: #7ed321; }

            .welcome-text {
                color: #ccc;
                font-size: 0.9rem;
                margin-right: 20px;
            }

            .filtro-container {
                background-color: #1a1a1a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 25px;
            }

            .filtro-label {
                color: #e6e6e6;
                font-weight: 500;
                margin-bottom: 10px;
                display: block;
            }

            .form-select-filtro {
                background-color: #2a2a2a;
                border: 1px solid #444;
                color: #e6e6e6;
                padding: 10px;
                border-radius: 5px;
                width: 100%;
            }

            .form-select-filtro:focus {
                background-color: #2a2a2a;
                border-color: #666;
                color: #e6e6e6;
                box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
            }

            .btn-limpar {
                background-color: #2a2a2a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 20px;
                border-radius: 5px;
                margin-left: 10px;
                transition: all 0.2s;
            }

            .btn-limpar:hover {
                background-color: #333;
                color: white;
            }

            .info-filtro {
                color: #50e3c2;
                font-weight: 500;
                margin-top: 15px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <span class="navbar-brand fw-bold">Lista de Jogadores</span>
                <div class="mx-auto d-flex align-items-center gap-2">
                    <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                    <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                    
                    <div class="btn-group dropstart">
                        <button
                            type="button"
                            class="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            ${usuario}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container-custom">
            <h2 class="page-title">Jogadores Cadastrados</h2>
            
            <div class="d-flex justify-content-between mb-4">
                <a href="/home" class="btn btn-cadastrar">Voltar para Home</a>
                <a href="/jogadores/cadastrar" class="btn btn-cadastrar">+ Cadastrar Novo Jogador</a>
            </div>
            
            <div class="filtro-container">
                <form action="/jogadores" method="GET" class="d-flex align-items-end">
                    <div style="flex: 1;">
                        <label class="filtro-label">Filtrar por Equipe</label>
                        <select name="equipe" class="form-select-filtro" onchange="this.form.submit()">
                            <option value="">Todas as equipes</option>
                            ${equipes.map(equipe => `
                                <option value="${equipe.nome}" ${filtroEquipe === equipe.nome ? 'selected' : ''}>${equipe.nome}</option>
                            `).join('')}
                            <option value="Sem equipe" ${filtroEquipe === 'Sem equipe' ? 'selected' : ''}>Sem equipe</option>
                        </select>
                    </div>
                    ${filtroEquipe ? `
                        <a href="/jogadores" class="btn btn-limpar">Limpar Filtro</a>
                    ` : ''}
                </form>
                
                ${filtroEquipe ? `
                    <div class="info-filtro">
                        Mostrando jogadores da equipe: <strong>${filtroEquipe}</strong>
                        (${jogadoresFiltrados.length} jogador${jogadoresFiltrados.length !== 1 ? 'es' : ''} encontrado${jogadoresFiltrados.length !== 1 ? 's' : ''})
                    </div>
                ` : `
                    <div class="info-filtro">
                        Mostrando todos os jogadores (${jogadoresFiltrados.length} jogador${jogadoresFiltrados.length !== 1 ? 'es' : ''} cadastrado${jogadoresFiltrados.length !== 1 ? 's' : ''})
                    </div>
                `}
            </div>
            
            <div class="table-responsive">
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nickname</th>
                            <th>Função</th>
                            <th>Elo</th>
                            <th>Gênero</th>
                            <th>Equipe</th>
                            <th>Data de Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
    if (jogadoresFiltrados.length === 0) {
        if (filtroEquipe) {
            html += `
                        <tr>
                            <td colspan="8" class="text-center">Nenhum jogador encontrado na equipe "${filtroEquipe}".</td>
                        </tr>`;
        } else {
            html += `
                        <tr>
                            <td colspan="8" class="text-center">Nenhum jogador cadastrado ainda.</td>
                        </tr>`;
        }
    } else {
        jogadoresFiltrados.forEach(jogador => {
            const badgeClass = `badge-${jogador.funcao}`;
            
            html += `
                        <tr>
                            <td>${jogador.id}</td>
                            <td>${jogador.nome}</td>
                            <td><strong>${jogador.nickname}</strong></td>
                            <td><span class="badge ${badgeClass}">${jogador.funcao}</span></td>
                            <td>${jogador.elo}</td>
                            <td>${jogador.genero}</td>
                            <td>${jogador.equipe}</td>
                            <td>${jogador.dataCadastro}</td>
                        </tr>`;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;
    
    res.send(html);
});

app.get("/equipes/cadastrar", (req, res) => {
    const usuario = req.session.user?.nome;
    const ultimoAcesso = req.cookies.ultimoAcesso;
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastrar Equipe - FIPP Of Legends</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background: #0e0e0e;
                color: #e6e6e6;
                font-family: "Segoe UI", sans-serif;
                margin: 0;
                padding: 0;
            }

            .navbar {
                background-color: #0e0e0e !important;
                border-bottom: 1px solid #444;
                padding: 10px 30px;
            }

            .navbar-text {
                font-size: 1.5rem;
                font-weight: bold;
                color: white !important;
            }

            .logo {
                width: 40px;
                height: 40px;
            }

            .dropdown-menu {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
            }

            .dropdown-menu .dropdown-item {
                color: #e6e6e6 !important;
            }

            .dropdown-menu .dropdown-item:hover {
                background-color: #333 !important;
                color: white !important;
            }

            .form-container {
                max-width: 800px;
                margin: 30px auto;
                padding: 30px;
                background: #1a1a1a;
                border-radius: 10px;
                border: 1px solid #444;
            }

            .form-title {
                color: white;
                margin-bottom: 30px;
                text-align: center;
                border-bottom: 1px solid #444;
                padding-bottom: 15px;
            }

            .form-label {
                color: #e6e6e6;
                font-weight: 500;
            }

            .form-control, .form-select {
                background-color: #2a2a2a;
                border: 1px solid #444;
                color: #e6e6e6;
                padding: 10px;
            }

            .form-control:focus, .form-select:focus {
                background-color: #2a2a2a;
                border-color: #666;
                color: #e6e6e6;
                box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
            }

            .btn-submit {
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 30px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .btn-submit:hover {
                background-color: #333;
                color: white;
                border-color: #666;
            }

            .btn-back {
                background-color: #2a2a2a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                transition: all 0.2s;
            }

            .btn-back:hover {
                background-color: #333;
                color: white;
                text-decoration: none;
            }

            .text-danger {
                color: #ff6b6b;
                font-size: 0.875rem;
                margin-top: 5px;
            }

            .welcome-text {
                color: #ccc;
                font-size: 0.9rem;
                margin-right: 20px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <span class="navbar-brand fw-bold">Cadastro de Equipes</span>
                <div class="mx-auto d-flex align-items-center gap-2">
                    <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                    <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                    
                    <div class="btn-group dropstart">
                        <button
                            type="button"
                            class="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            ${usuario}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container">
            <div class="form-container">
                <h2 class="form-title">Cadastrar Nova Equipe</h2>
                
                <form action="/equipes/cadastrar" method="POST">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Nome da Equipe *</label>
                            <input type="text" name="nome" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Nome do Capitão *</label>
                            <input type="text" name="capitao" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Telefone/WhatsApp *</label>
                            <input type="text" name="telefone" class="form-control">
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-12 d-flex justify-content-between">
                            <div class="col-md-6">
                                <a href="/home" class="btn btn-back">Voltar para Home</a>
                                <a href="/equipes" class="btn btn-back">Voltar para Lista</a>
                            </div>

                            <button type="submit" class="btn btn-submit">Cadastrar Equipe</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            (function () {
                function aplicarMascaraTelefone(value) {
                    return value
                        .replace(/\\D/g, "")
                        .replace(/^(\\d{2})(\\d)/, "($1) $2")
                        .replace(/(\\d{5})(\\d)/, "$1-$2")
                        .slice(0, 15);
                }

                const telInput = document.querySelector("input[name='telefone']");
                const form = document.querySelector("form");

                if (!telInput || !form) {
                    console.warn("Input de telefone não encontrado no DOM.");
                    return;
                }

                telInput.addEventListener("input", function (e) {
                    e.target.value = aplicarMascaraTelefone(e.target.value);
                });

                form.addEventListener("submit", function () {
                    telInput.value = telInput.value.replace(/\\D/g, "");
                });
            })();
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

app.post("/equipes/cadastrar", (req, res) => {
    const { nome, capitao, telefone } = req.body;
    
    let erroNome = !nome ? "O campo Nome da Equipe é obrigatório." : "";
    let erroCapitao = !capitao ? "O campo Nome do Capitão é obrigatório." : "";
    let erroTelefone = !telefone ? "O campo Telefone/WhatsApp é obrigatório." : "";

    if (erroNome || erroCapitao || erroTelefone) {
        const usuario = req.session.user?.nome;
        const ultimoAcesso = req.cookies.ultimoAcesso;
        
        const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Cadastrar Equipe - FIPP Of Legends</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background: #0e0e0e;
                    color: #e6e6e6;
                    font-family: "Segoe UI", sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .navbar {
                    background-color: #0e0e0e !important;
                    border-bottom: 1px solid #444;
                    padding: 10px 30px;
                }

                .navbar-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white !important;
                }

                .logo {
                    width: 40px;
                    height: 40px;
                }

                .dropdown-menu {
                    background-color: #1a1a1a !important;
                    border: 1px solid #444 !important;
                }

                .dropdown-menu .dropdown-item {
                    color: #e6e6e6 !important;
                }

                .dropdown-menu .dropdown-item:hover {
                    background-color: #333 !important;
                    color: white !important;
                }

                .form-container {
                    max-width: 800px;
                    margin: 30px auto;
                    padding: 30px;
                    background: #1a1a1a;
                    border-radius: 10px;
                    border: 1px solid #444;
                }

                .form-title {
                    color: white;
                    margin-bottom: 30px;
                    text-align: center;
                    border-bottom: 1px solid #444;
                    padding-bottom: 15px;
                }

                .form-label {
                    color: #e6e6e6;
                    font-weight: 500;
                }

                .form-control, .form-select {
                    background-color: #2a2a2a;
                    border: 1px solid #444;
                    color: #e6e6e6;
                    padding: 10px;
                }

                .form-control:focus, .form-select:focus {
                    background-color: #2a2a2a;
                    border-color: #666;
                    color: #e6e6e6;
                    box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
                }

                .btn-submit {
                    background-color: #1a1a1a;
                    color: #e6e6e6;
                    border: 1px solid #444;
                    padding: 10px 30px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .btn-submit:hover {
                    background-color: #333;
                    color: white;
                    border-color: #666;
                }

                .btn-back {
                    background-color: #2a2a2a;
                    color: #e6e6e6;
                    border: 1px solid #444;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: all 0.2s;
                }

                .btn-back:hover {
                    background-color: #333;
                    color: white;
                    text-decoration: none;
                }

                .text-danger {
                    color: #ff6b6b;
                    font-size: 0.875rem;
                    margin-top: 5px;
                }

                .welcome-text {
                    color: #ccc;
                    font-size: 0.9rem;
                    margin-right: 20px;
                }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <div class="container-fluid">
                    <span class="navbar-brand fw-bold">Cadastro de Equipes</span>
                    <div class="mx-auto d-flex align-items-center gap-2">
                        <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                        <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                    </div>

                    <div class="d-flex align-items-center">
                        <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                        
                        <div class="btn-group dropstart">
                            <button
                                type="button"
                                class="btn btn-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                ${usuario}
                            </button>

                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="container">
                <div class="form-container">
                    <h2 class="form-title">Cadastrar Nova Equipe</h2>
                    
                    <form action="/equipes/cadastrar" method="POST">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Nome da Equipe *</label>
                                <input type="text" name="nome" class="form-control" value="${nome || ""}">
                                ${erroNome ? `<p class="text-danger">${erroNome}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Nome do Capitão *</label>
                                <input type="text" name="capitao" class="form-control" value="${capitao || ""}">
                                ${erroCapitao ? `<p class="text-danger">${erroCapitao}</p>` : ""}
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Telefone/WhatsApp *</label>
                                <input type="text" name="telefone" class="form-control" value="${telefone || ""}">
                                ${erroTelefone ? `<p class="text-danger">${erroTelefone}</p>` : ""}
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-12 d-flex justify-content-between">
                                <div class="col-md-6">
                                    <a href="/home" class="btn btn-back">Voltar para Home</a>
                                    <a href="/equipes" class="btn btn-back">Voltar para Lista</a>
                                </div>

                                <button type="submit" class="btn btn-submit">Cadastrar Equipe</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            
            <script>
                (function () {
                    function aplicarMascaraTelefone(value) {
                        return value
                            .replace(/\\D/g, "")
                            .replace(/^(\\d{2})(\\d)/, "($1) $2")
                            .replace(/(\\d{5})(\\d)/, "$1-$2")
                            .slice(0, 15);
                    }

                    const telInput = document.querySelector("input[name='telefone']");
                    const form = document.querySelector("form");

                    if (!telInput || !form) {
                        console.warn("Input de telefone não encontrado no DOM.");
                        return;
                    }

                    telInput.addEventListener("input", function (e) {
                        e.target.value = aplicarMascaraTelefone(e.target.value);
                    });

                    form.addEventListener("submit", function () {
                        telInput.value = telInput.value.replace(/\\D/g, "");
                    });
                })();
            </script>
        </body>
        </html>
        `;
        
        return res.send(html);
    }
    
    const novaEquipe = {
        id: equipes.length + 1,
        nome,
        capitao,
        telefone,
        dataCadastro: new Date().toLocaleString()
    };
    
    equipes.push(novaEquipe);
    res.redirect("/equipes");
});

app.get("/equipes", (req, res) => {
    const usuario = req.session.user?.nome;
    const ultimoAcesso = req.cookies.ultimoAcesso;
    
    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lista de Equipes - FIPP Of Legends</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background: #0e0e0e;
                color: #e6e6e6;
                font-family: "Segoe UI", sans-serif;
            }

            .navbar {
                background-color: #0e0e0e !important;
                border-bottom: 1px solid #444;
                padding: 10px 30px;
            }

            .navbar-text {
                font-size: 1.5rem;
                font-weight: bold;
                color: white !important;
            }

            .container-custom {
                max-width: 1200px;
                margin: 30px auto;
                padding: 20px;
            }

            .page-title {
                color: white;
                margin-bottom: 30px;
                text-align: center;
            }

            .btn-cadastrar {
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid #444;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                transition: all 0.2s;
            }

            .btn-cadastrar:hover {
                background-color: #333;
                color: white;
                text-decoration: none;
            }

            .table-dark {
                background-color: #1a1a1a;
                border: 1px solid #444;
            }

            .table-dark th {
                background-color: #2a2a2a;
                border-color: #444;
                color: #e6e6e6;
            }

            .table-dark td {
                border-color: #444;
                color: #ddd;
            }

            .badge {
                font-size: 0.85em;
                padding: 5px 10px;
                background-color: #4a90e2;
            }
            
            .jogadores-count {
                font-weight: bold;
                color: #50e3c2;
            }

            .welcome-text {
                color: #ccc;
                font-size: 0.9rem;
                margin-right: 20px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <div class="container-fluid">
                <span class="navbar-brand fw-bold">Lista de Equipes</span>
                <div class="mx-auto d-flex align-items-center gap-2">
                    <img src="/Logo.webp" class="rounded" alt="Logo" width="40" height="40">
                    <span class="navbar-text fs-4 fw-semibold text-white">FIPP of Legends</span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="welcome-text">Último acesso: ${ultimoAcesso}</span>
                    
                    <div class="btn-group dropstart">
                        <button
                            type="button"
                            class="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            ${usuario}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-danger" href="/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container-custom">
            <h2 class="page-title">Equipes Cadastradas</h2>
            
            <div class="d-flex justify-content-between mb-4">
                <a href="/home" class="btn btn-cadastrar">Voltar para Home</a>
                <a href="/equipes/cadastrar" class="btn btn-cadastrar">+ Cadastrar Nova Equipe</a>
            </div>
            
            <div class="table-responsive">
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome da Equipe</th>
                            <th>Capitão</th>
                            <th>Telefone/WhatsApp</th>
                            <th>Jogadores</th>
                            <th>Data de Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
    if (equipes.length === 0) {
        html += `
                        <tr>
                            <td colspan="6" class="text-center">Nenhuma equipe cadastrada ainda.</td>
                        </tr>`;
    } else {
        equipes.forEach(equipe => {
            const jogadoresNaEquipe = jogadores.filter(j => j.equipe === equipe.nome);
            const countJogadores = jogadoresNaEquipe.length;
            
            const telefoneFormatado = equipe.telefone ? 
                equipe.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : 
                equipe.telefone;
            
            html += `
                        <tr>
                            <td>${equipe.id}</td>
                            <td><strong>${equipe.nome}</strong></td>
                            <td>${equipe.capitao}</td>
                            <td>${telefoneFormatado}</td>
                            <td><span class="jogadores-count">${countJogadores}</span> jogador(es)</td>
                            <td>${equipe.dataCadastro}</td>
                        </tr>`;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;
    
    res.send(html);
});

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));