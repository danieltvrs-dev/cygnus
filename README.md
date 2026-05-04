<div align="center">
  <br/>
  <img src="assets/images/logo.png" width="72" alt="Cygnus"/>
  <br/>
  <br/>

  <h1>CYGNUS</h1>
  <p><em>Simulador de Plataforma de Streaming</em></p>

  <br/>

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/TMDB_API-01B4E4?style=flat-square&logo=themoviedatabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white"/>

  <br/>
  <br/>

  <a href="https://cygnusx1.netlify.app">
    <img src="https://img.shields.io/badge/Ver%20Demo%20ao%20Vivo-%E2%86%92-F5C518?style=for-the-badge"/>
  </a>

  <br/>
  <br/>

  <img src="https://img.shields.io/badge/Zero%20Frameworks-Vanilla%20JS-black?style=flat-square"/>
  <img src="https://img.shields.io/badge/Status-Concluído-brightgreen?style=flat-square"/>

  <br/>
  <br/>

</div>

---

## Sobre o Projeto

**Cygnus** é uma interface completa de plataforma de streaming construída do zero com HTML, CSS e JavaScript puro, sem frameworks, sem bibliotecas, sem dependências externas. O objetivo foi replicar a experiência visual e de navegação de serviços como Netflix e Disney+, integrando dados reais via TMDB API.

O nome é uma referência ao **Cygnus X-1**, o primeiro buraco negro confirmado da história, localizado na constelação de Cygnus, tema que aparece na splash screen do projeto, com animação de disco de acreção, jatos relativísticos e pulsos de raio-X, tudo em CSS puro.

---

## Funcionalidades

<table>
<tr>
<td width="50%">

**Autenticação & Perfis**
- Telas de login e cadastro com validação
- Seleção de perfil com slideshow TMDB ao fundo
- 24 avatares gerados via DiceBear API
- Splash de perfil animada na entrada
- Modo Infantil com conteúdo e visual exclusivos

</td>
<td width="50%">

**Home & Navegação**
- Hero slideshow com avanço automático (12s)
- Logotipos oficiais PT-BR com detecção de cor via canvas
- Carrosséis com drag scroll por gênero e popularidade
- Top 10 estilizado — filmes e séries separados
- Busca em tempo real com histórico

</td>
</tr>
<tr>
<td width="50%">

**Detalhes & Player**
- Backdrop + logo PT-BR automático
- Fallback: poster borrado quando sem backdrop no TMDB
- Elenco, títulos semelhantes e informações completas
- Roteamento correto entre `movie` e `tv`
- Interface de player

</td>
<td width="50%">

**Kids Mode**
- Home separada com tema escuro/colorido
- Sparkles animadas e ícones SVG exclusivos
- Conteúdo filtrado: Animação, Família, Infantil
- 4 carrosséis temáticos com cores distintas

</td>
</tr>
</table>

---

## Fluxo de Navegação

```
┌─────────────┐     ┌───────────────┐     ┌────────────┐
│  index.html │ ──▶ │disclaimer.html│ ──▶ │ login.html │
│  Splash X-1 │     │  Aviso Legal  │     │   Login    │
└─────────────┘     └───────────────┘     └─────┬──────┘
                                                 │
                                    ┌────────────▼───────────┐
                                    │      profiles.html      │
                                    │   Seleção de Perfil     │
                                    └────────────┬────────────┘
                                                 │
                                    ┌────────────▼───────────┐
                                    │   profile-intro.html    │
                                    │  Animação de Entrada    │
                                    └──────┬──────────┬───────┘
                                           │          │
                              ┌────────────▼──┐  ┌───▼──────────────┐
                              │   home.html   │  │ home-kids.html   │
                              │     Home      │  │   Home Infantil  │
                              └───────────────┘  └──────────────────┘
```

---

## Páginas

| | Arquivo | Descrição |
|:---:|---|---|
| <img src="https://api.iconify.design/heroicons/film.svg?color=%23F5C518" width="18"/> | `index.html` | Splash screen — Cygnus X-1 |
| <img src="https://api.iconify.design/heroicons/document-text.svg?color=%23F5C518" width="18"/> | `disclaimer.html` | Aviso legal e créditos TMDB |
| <img src="https://api.iconify.design/heroicons/lock-closed.svg?color=%23F5C518" width="18"/> | `login.html` | Autenticação |
| <img src="https://api.iconify.design/heroicons/user-plus.svg?color=%23F5C518" width="18"/> | `signup.html` | Cadastro com validação de termos |
| <img src="https://api.iconify.design/heroicons/user-group.svg?color=%23F5C518" width="18"/> | `profiles.html` | Seleção de perfil com slideshow |
| <img src="https://api.iconify.design/heroicons/sparkles.svg?color=%23F5C518" width="18"/> | `profile-intro.html` | Animação de entrada no perfil |
| <img src="https://api.iconify.design/heroicons/home.svg?color=%23F5C518" width="18"/> | `home.html` | Home principal |
| <img src="https://api.iconify.design/heroicons/star.svg?color=%23F5C518" width="18"/> | `home-kids.html` | Home do perfil infantil |
| <img src="https://api.iconify.design/heroicons/information-circle.svg?color=%23F5C518" width="18"/> | `details.html` | Detalhes de filme ou série |
| <img src="https://api.iconify.design/heroicons/play-circle.svg?color=%23F5C518" width="18"/> | `player.html` | Player de vídeo |
| <img src="https://api.iconify.design/heroicons/magnifying-glass.svg?color=%23F5C518" width="18"/> | `search.html` | Busca com filtros e categorias |
| <img src="https://api.iconify.design/heroicons/squares-2x2.svg?color=%23F5C518" width="18"/> | `catalog.html` | Catálogo completo |
| <img src="https://api.iconify.design/heroicons/heart.svg?color=%23F5C518" width="18"/> | `favorites.html` | Favoritos |
| <img src="https://api.iconify.design/heroicons/bookmark.svg?color=%23F5C518" width="18"/> | `my-list.html` | Minha lista |
| <img src="https://api.iconify.design/heroicons/forward.svg?color=%23F5C518" width="18"/> | `keep-watching.html` | Continuar assistindo |

---

## Estrutura

```
cygnus/
│
├── 📄 index.html               Splash screen
├── 📄 disclaimer.html          Aviso legal
├── 📄 login.html / signup.html Autenticação
├── 📄 profiles.html            Seleção de perfil
├── 📄 profile-intro.html       Entrada no perfil
├── 📄 home.html                Home principal
├── 📄 home-kids.html           Home infantil
├── 📄 details.html             Detalhes
├── 📄 player.html              Player
├── 📄 search.html              Busca
├── 📄 catalog.html             Catálogo
│
├── 📁 assets/
│   └── images/logo.png
│
└── 📁 js/
    ├── api/
    │   └── tmdb.js             Wrapper da API
    ├── utils/
    │   ├── storage.js          localStorage
    │   ├── helpers.js          Utilitários
    │   └── router.js           Roteamento
    ├── components/
    │   ├── card.js             Cards e carrosséis
    │   ├── sidebar.js          Sidebar
    │   └── modal.js            Modal
    ├── pages/
    │   ├── home.js
    │   ├── details.js
    │   ├── profiles.js
    │   ├── search.js
    │   ├── catalog.js
    │   ├── login.js
    │   └── player.js
    └── main.js
```

---

## Stack

<div align="center">

| | Tecnologia | Finalidade |
|:---:|---|---|
| <img src="https://img.shields.io/badge/-E34F26?style=flat-square&logo=html5&logoColor=white" width="20"/> | **HTML5** | Estrutura semântica |
| <img src="https://api.iconify.design/logos/css-3.svg" width="20"/> | **CSS3** | Animações, Flexbox, Grid |
| <img src="https://img.shields.io/badge/-F7DF1E?style=flat-square&logo=javascript&logoColor=black" width="20"/> | **JavaScript ES6+** | Lógica, componentes, navegação |
| <img src="https://img.shields.io/badge/-01B4E4?style=flat-square&logo=themoviedatabase&logoColor=white" width="20"/> | **TMDB API** | Filmes, séries, imagens |
| <img src="https://img.shields.io/badge/-000?style=flat-square&logo=dicebear&logoColor=white" width="20"/> | **DiceBear API** | Avatares dos perfis |

</div>

> Construído sem frameworks, zero dependências externas.

---

## Aviso Legal

<div align="center">

Este projeto é um simulador desenvolvido exclusivamente para fins **educacionais e de portfólio**.  
Nenhum conteúdo está hospedado nesta aplicação.

<br/>

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" height="22" alt="TMDB Logo"/>

<br/>
<br/>

Os dados de filmes e séries são fornecidos pela **API do TMDB**.  
Este produto **não é endossado ou certificado pelo TMDB**.  
Sem finalidade comercial.

</div>

---

<div align="center">
  <br/>
  <img src="assets/images/logo.png" width="28" alt="Cygnus"/>
  <br/>
  <sub>Desenvolvido por <strong>Daniel Tavares</strong> &nbsp;·&nbsp; 2026</sub>
  <br/>
  <br/>
</div>
