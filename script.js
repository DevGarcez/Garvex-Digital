// ===== CONFIGURAÇÃO (edite apenas aqui) =====
const GARVEX = {
  whatsapp: "5544998278314", // DDI + DDD + número, só dígitos
  // Mensagem de cada botão, conforme o atributo data-wa="..." no index.html
  messages: {
    cabecalho: "Olá! Conheci a Garvex Digital pelo site e gostaria de saber mais sobre a criação de landing pages para o meu negócio. Poderia me explicar como funciona?",
    hero: "Olá! Conheci a Garvex Digital pelo site e gostaria de criar uma landing page para o meu negócio. Quero entender como funciona o projeto e quais são os próximos passos.",
    servicos: "Olá! Conheci os serviços da Garvex Digital pelo site e gostaria de entender como uma landing page poderia ajudar o meu negócio. Podemos conversar?",
    essencial: "Olá! Conheci a Garvex Digital pelo site e tenho interesse no plano Essencial. Gostaria de saber mais sobre o que está incluso e como funciona a contratação.",
    profissional: "Olá! Conheci a Garvex Digital pelo site e tenho interesse no plano Profissional. Gostaria de entender melhor como funciona a criação da landing page e como podemos começar.",
    flutuante: "Olá! Conheci a Garvex Digital pelo site e gostaria de tirar algumas dúvidas sobre a criação de landing pages.",
    rodape: "Olá! Acessei o site da Garvex Digital e gostaria de conversar sobre os serviços.",
    // botão "Conversar sobre meu projeto" quando nenhuma opção foi escolhida
    projeto: "Olá! Conheci a Garvex Digital pelo site e gostaria de criar uma landing page para o meu negócio. Quero entender como funciona o projeto e quais são os próximos passos."
  },
  // Mensagens das opções da última seção (data-goal="..." no index.html)
  goals: {
    vender: "Olá! Conheci a Garvex Digital pelo site e quero criar uma landing page para apresentar e vender meu produto ou serviço. Gostaria de conversar sobre meu projeto e entender qual plano seria mais adequado.",
    contatos: "Olá! Conheci a Garvex Digital pelo site e quero criar uma landing page para gerar mais contatos para o meu negócio. Gostaria de entender como funciona o serviço e qual solução você recomenda.",
    apresentar: "Olá! Conheci a Garvex Digital pelo site e quero uma landing page para apresentar melhor minha empresa, meus serviços e meus diferenciais. Podemos conversar sobre o projeto?",
    decidindo: "Olá! Conheci a Garvex Digital pelo site e estou avaliando a possibilidade de criar uma landing page para o meu negócio. Ainda não defini exatamente o que preciso e gostaria de entender as opções disponíveis."
  },
  // Métricas (opcional): cole os IDs para ativar. Deixe vazio para não carregar nada.
  ga4: "",        // exemplo: "G-XXXXXXXXXX"
  metaPixel: ""   // exemplo: "123456789012345"
};

// Projetos do portfólio. Enquanto a lista estiver vazia, a seção "Projetos" fica oculta.
// Salve as imagens em assets/projetos/ (de preferência .webp) e preencha assim:
// { nome: "Nome do cliente", segmento: "Insulfilm automotivo", descricao: "O que a página precisava resolver e o que foi entregue.",
//   desktop: "assets/projetos/cliente-desktop.webp", mobile: "assets/projetos/cliente-mobile.webp", link: "https://..." }
// (mobile e link são opcionais)
const CASES = [];
// ============================================

const $ = (s, c = document) => [...c.querySelectorAll(s)];
const toast = $('.toast')[0];
const hasNumber = /^\d{10,15}$/.test(GARVEX.whatsapp);

// ----- Métricas (só carrega se houver ID) -----
const add = (src, inline) => { const s = document.createElement('script'); if (src) { s.async = true; s.src = src; } else s.textContent = inline; document.head.appendChild(s); };
if (GARVEX.ga4) {
  add('https://www.googletagmanager.com/gtag/js?id=' + GARVEX.ga4);
  add(null, "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','" + GARVEX.ga4 + "');");
}
if (GARVEX.metaPixel) {
  add(null, "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src='https://connect.facebook.net/en_US/fbevents.js';s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script');fbq('init','" + GARVEX.metaPixel + "');fbq('track','PageView');");
}
const track = place => {
  if (window.gtag) gtag('event', 'whatsapp_click', { local: place });
  if (window.fbq) fbq('track', 'Contact');
};

// ----- WhatsApp -----
// cada botão usa a mensagem do seu contexto; só o botão da última seção muda com a opção escolhida
let goal = null;
const waLinks = $('[data-wa]');
const msgFor = a => a.dataset.wa === 'projeto'
  ? (GARVEX.goals[goal] || GARVEX.messages.projeto)
  : (GARVEX.messages[a.dataset.wa] || GARVEX.messages.cabecalho);
const setWa = () => waLinks.forEach(a => {
  if (hasNumber) { a.href = `https://wa.me/${GARVEX.whatsapp}?text=${encodeURIComponent(msgFor(a))}`; a.target = '_blank'; a.rel = 'noopener'; }
});
setWa();
waLinks.forEach(a => a.addEventListener('click', e => {
  if (!hasNumber) {
    e.preventDefault();
    toast.textContent = 'Número do WhatsApp ainda não configurado. Defina-o em script.js.';
    toast.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => toast.hidden = true, 4000);
    return;
  }
  const sec = a.closest('section, header, footer');
  track(a.dataset.wa === 'projeto' && goal ? 'projeto-' + goal : a.dataset.wa || (sec && sec.id) || 'pagina');
}));

// ----- Escolha de objetivo -----
$('.goal__chip').forEach(chip => chip.addEventListener('click', () => {
  const on = chip.getAttribute('aria-pressed') === 'true';
  $('.goal__chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  // clicar de novo na opção marcada desfaz a escolha e volta à mensagem geral
  goal = on ? null : chip.dataset.goal;
  if (goal) chip.setAttribute('aria-pressed', 'true');
  setWa();
}));

// ----- Projetos -----
if (CASES.length) {
  const grid = $('#casesGrid')[0];
  const el = (t, c, txt) => { const n = document.createElement(t); if (c) n.className = c; if (txt) n.textContent = txt; return n; };
  CASES.forEach(c => {
    const art = el('article', 'case');
    const shot = el('div', 'case__shot');
    const img = el('img'); img.src = c.desktop; img.alt = `Landing page criada para ${c.nome}`; img.loading = 'lazy'; shot.appendChild(img);
    if (c.mobile) { const ph = el('div', 'case__phone'); const i2 = el('img'); i2.src = c.mobile; i2.alt = `Versão para celular da página de ${c.nome}`; i2.loading = 'lazy'; ph.appendChild(i2); shot.appendChild(ph); }
    art.appendChild(shot);
    if (c.segmento) art.appendChild(el('span', 'case__seg', c.segmento));
    art.appendChild(el('h3', '', c.nome));
    if (c.descricao) art.appendChild(el('p', '', c.descricao));
    if (c.link) { const a = el('a', 'link', 'Ver página ao vivo'); a.href = c.link; a.target = '_blank'; a.rel = 'noopener'; art.appendChild(a); }
    grid.appendChild(art);
  });
  $('#projetos')[0].hidden = false;
  $('#navProjetos')[0].hidden = false;
}

// ----- Botão flutuante: escondido enquanto o botão principal do hero aparece -----
const heroCta = $('.hero__actions')[0];
if (heroCta && 'IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => document.body.classList.toggle('fab-off', en.isIntersecting)).observe(heroCta);
}

// ----- Menu mobile -----
const btn = $('.top__toggle')[0], nav = $('#menu')[0];
const header = $('.top')[0];
const close = () => { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); header.classList.remove('is-open'); };
btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', !o); nav.classList.toggle('open', !o); header.classList.toggle('is-open', !o); });
nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); } });
// fecha o menu ao tocar/clicar fora dele
document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) close(); });

// ----- Cabeçalho: ganha fundo conforme a rolagem (0 no topo, 1 após ~96px) -----
let headTick = false;
const headUpdate = () => { header.style.setProperty('--p', Math.min(1, Math.max(0, scrollY / 96)).toFixed(3)); headTick = false; };
addEventListener('scroll', () => { if (!headTick) { headTick = true; requestAnimationFrame(headUpdate); } }, { passive: true });
headUpdate();

$('#ano')[0].textContent = new Date().getFullYear();

// parallax suave dos objetos de vidro (desligado com movimento reduzido)
const stage = $('.stage')[0];
if (stage && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover)').matches) {
  // no máximo uma atualização por quadro
  let px = null;
  stage.addEventListener('pointermove', e => {
    const wasIdle = px === null;
    px = e;
    if (!wasIdle) return;
    requestAnimationFrame(() => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', ((px.clientX - r.left) / r.width - .5).toFixed(3));
      stage.style.setProperty('--my', ((px.clientY - r.top) / r.height - .5).toFixed(3));
      px = null;
    });
  });
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); });
}

// entrada dos blocos ao rolar, em sequência (conteúdo continua visível sem JS)
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  const alvos = $('.strip li, .serv article, .anat__text, .anat__demo, .dif__side, .dif dl>div, .proc__intro h2, .proc li, .faq h2, details, .pos h2, .pos p, .pain li, .for h2, .for li, .case, .plans__head, .plan, .plans__notes, .estudio__who, .estudio__area, .final h2');
  alvos.forEach(el => el.classList.add('rv'));
  alvos.forEach(el => {
    const i = [...el.parentElement.children].filter(c => c.classList.contains('rv')).indexOf(el);
    el.style.setProperty('--d', Math.min(i, 6) * 0.09 + 's');
    io.observe(el);
  });
}
