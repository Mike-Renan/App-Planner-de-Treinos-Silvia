const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
const STORAGE_KEY = 'treinosSemana'
const MONTHLY_KEY = 'treinosHistorico'

const state = {
  dia: 0,
  dados: carregar(),
  view: 'semanal',
  editingIndex: null,
  historico: carregarHistorico()
}

function carregar() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  return [
    [
      { nome: 'Supino reto', grupo: 'Peito', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4', obs: '4x8-10', feito: false },
      { nome: 'Crucifixo com halteres', grupo: 'Peito', video: '', obs: '3x12', feito: false }
    ],
    [
      { nome: 'Remada curvada', grupo: 'Costas', video: 'https://www.youtube.com/watch?v=roCP6wCXPqo', obs: '4x10', feito: false },
      { nome: 'Barra fixa', grupo: 'Costas', video: '', obs: '3 séries até a falha', feito: false }
    ],
    [
      { nome: 'Agachamento livre', grupo: 'Pernas', video: 'https://www.youtube.com/watch?v=Dy28eq2PjcM', obs: '5x5', feito: false },
      { nome: 'Leg press', grupo: 'Pernas', video: '', obs: '4x12', feito: false }
    ],
    [
      { nome: 'Desenvolvimento com barra', grupo: 'Ombros', video: 'https://www.youtube.com/watch?v=qEwKCR5JCog', obs: '4x8', feito: false },
      { nome: 'Elevação lateral', grupo: 'Ombros', video: '', obs: '3x15', feito: false }
    ],
    [
      { nome: 'Rosca direta', grupo: 'Bíceps', video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', obs: '4x10', feito: false },
      { nome: 'Tríceps testa', grupo: 'Tríceps', video: 'https://www.youtube.com/watch?v=vB5OHsJ3EME', obs: '4x12', feito: false }
    ]
  ]
}

function carregarHistorico() {
  const raw = localStorage.getItem(MONTHLY_KEY)
  return raw ? JSON.parse(raw) : {}
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dados))
}

function salvarHistorico(novo) {
  localStorage.setItem(MONTHLY_KEY, JSON.stringify(novo))
  state.historico = novo
}

// DOM refs
const tabsEl = document.getElementById('tabs')
const gridEl = document.getElementById('exerciseGrid')
const addBtn = document.getElementById('addExerciseBtn')
const summaryEl = document.getElementById('summary')
const mensalView = document.getElementById('mensalView')
const semanalView = document.getElementById('semanalView')
const btnSemanal = document.getElementById('btnSemanal')
const btnMensal = document.getElementById('btnMensal')
const modalRoot = document.getElementById('modalRoot')

function setView(v) {
  state.view = v
  semanalView.classList.toggle('hidden', v !== 'semanal')
  mensalView.classList.toggle('hidden', v !== 'mensal')
  btnSemanal.classList.toggle('bg-gradient-to-r', v === 'semanal')
  btnMensal.classList.toggle('bg-gradient-to-r', v === 'mensal')
  if (v === 'mensal') renderMonthlyStats()
}

btnSemanal.onclick = () => setView('semanal')
btnMensal.onclick = () => setView('mensal')

function toggleFeito(index) {
  const ex = state.dados[state.dia][index]
  ex.feito = !ex.feito

  const hoje = new Date()
  const mesAno = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
  const dia_mes = String(hoje.getDate()).padStart(2, '0')
  const chave = `${mesAno}-${dia_mes}-${DIAS[state.dia]}`

  const novoHistorico = { ...state.historico }
  if (ex.feito) novoHistorico[chave] = (novoHistorico[chave] || 0) + 1
  else novoHistorico[chave] = Math.max(0, (novoHistorico[chave] || 0) - 1)

  salvar()
  salvarHistorico(novoHistorico)
  render()
}

function editar(index) {
  state.editingIndex = index
  openModal(state.dados[state.dia][index])
}

function excluir(index) {
  if (!confirm('Tem certeza que deseja excluir este exercício?')) return
  state.dados[state.dia].splice(index, 1)
  salvar()
  render()
}

function renderTabs() {
  tabsEl.innerHTML = ''
  DIAS.forEach((d, i) => {
    const btn = document.createElement('button')
    btn.className = `px-6 py-2 rounded-lg font-semibold transition ${i === state.dia ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700/40'}`
    btn.textContent = d
    btn.onclick = () => { state.dia = i; render() }
    tabsEl.appendChild(btn)
  })
}

function getVideoEmbed(url) {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com.*v=)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return null
}

function renderGrid() {
  gridEl.innerHTML = ''
  const exercicios = state.dados[state.dia]
  if (!exercicios.length) {
    gridEl.innerHTML = '<div class="text-center py-12 w-full"><p class="text-white text-2xl font-bold">Nenhum exercício adicionado para este dia 😴</p></div>'
    return
  }

  const container = document.createElement('div')
  container.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-4xl'

  exercicios.forEach((ex, idx) => {
    const card = document.createElement('div')
    card.className = `rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 backdrop-blur-sm border ${ex.feito ? 'border-green-800/40 bg-gray-800/60 shadow-green-600/20' : 'border-gray-700/40 bg-gray-800/60 shadow-purple-500/15'}`

    const header = document.createElement('div')
    header.className = 'bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 p-5 relative overflow-hidden'
    header.innerHTML = `<div class="flex justify-between items-start gap-2 relative z-10"><div><h3 class="text-white font-bold text-lg uppercase tracking-wide">${ex.nome}</h3><span class="text-cyan-100 text-sm font-semibold">${ex.grupo}</span></div><label class="relative cursor-pointer"><input type="checkbox" class="w-6 h-6 appearance-none bg-white/20 border-2 border-cyan-400 rounded-lg checked:bg-gradient-to-r checked:from-pink-500 checked:to-cyan-500 cursor-pointer" ${ex.feito ? 'checked' : ''}></label></div>`
    const chk = header.querySelector('input')
    chk.onchange = () => toggleFeito(idx)

    card.appendChild(header)

    const videoEmbed = getVideoEmbed(ex.video)
    if (videoEmbed) {
      const vwrap = document.createElement('div')
      vwrap.className = 'p-5 flex flex-col items-center'
      vwrap.innerHTML = `<div class="w-full"><iframe width="100%" height="220" src="${videoEmbed}" frameborder="0" allowfullscreen class="rounded-lg shadow-lg shadow-cyan-500/30"></iframe></div>`
      card.appendChild(vwrap)
    } else {
      const novideo = document.createElement('div')
      novideo.className = 'p-5 text-center'
      novideo.innerHTML = '<span class="text-gray-400 font-semibold">📹 Sem vídeo</span>'
      card.appendChild(novideo)
    }

    const body = document.createElement('div')
    body.className = 'p-5 border-t border-gray-700/30'
    body.innerHTML = `<p class="text-gray-300 mb-4 text-center font-semibold">${ex.obs || 'Sem observações'}</p>`

    const btns = document.createElement('div')
    btns.className = 'flex gap-3 flex-col'
    const editBtn = document.createElement('button')
    editBtn.className = 'w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2.5 rounded-lg uppercase text-sm'
    editBtn.textContent = '✏️ Editar'
    editBtn.onclick = () => editar(idx)
    const delBtn = document.createElement('button')
    delBtn.className = 'w-full bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold py-2.5 rounded-lg uppercase text-sm'
    delBtn.textContent = '🗑️ Excluir'
    delBtn.onclick = () => excluir(idx)
    btns.appendChild(editBtn); btns.appendChild(delBtn)

    body.appendChild(btns)
    card.appendChild(body)
    container.appendChild(card)
  })

  gridEl.appendChild(container)
}

function openModal(exercicio = null) {
  modalRoot.innerHTML = ''
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50'

  const box = document.createElement('div')
  box.className = 'bg-gray-800 rounded-2xl shadow-lg max-w-md w-full p-8 border border-gray-700/40'

  box.innerHTML = `
    <h2 class="text-3xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 uppercase tracking-wide">${exercicio ? '✏️ Editar' : '➕ Novo Exercício'}</h2>
    <form class="space-y-4">
      <div>
        <label class="block text-cyan-300 font-bold mb-2 uppercase text-sm tracking-wider">Nome do Exercício *</label>
        <input name="nome" type="text" class="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500/40 text-white rounded-lg" placeholder="Ex: Supino Reto" required />
      </div>
      <div>
        <label class="block text-cyan-300 font-bold mb-2 uppercase text-sm tracking-wider">Grupo Muscular</label>
        <input name="grupo" type="text" class="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500/40 text-white rounded-lg" placeholder="Ex: Peito" />
      </div>
      <div>
        <label class="block text-cyan-300 font-bold mb-2 uppercase text-sm tracking-wider">Link do Vídeo</label>
        <input name="video" type="url" class="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500/40 text-white rounded-lg" placeholder="https://youtube.com/..." />
      </div>
      <div>
        <label class="block text-cyan-300 font-bold mb-2 uppercase text-sm tracking-wider">Observações</label>
        <textarea name="obs" rows="3" class="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500/40 text-white rounded-lg resize-none" placeholder="Ex: 4x8-10 repetições"></textarea>
      </div>
      <div class="flex gap-3 pt-6 flex-col">
        <button type="submit" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg">Salvar</button>
        <button type="button" class="w-full bg-gray-700 text-gray-200 font-bold py-3 rounded-lg">Cancelar</button>
      </div>
    </form>`

  const form = box.querySelector('form')
  const cancelar = box.querySelector('button[type="button"]')

  if (exercicio) {
    form.nome.value = exercicio.nome || ''
    form.grupo.value = exercicio.grupo || ''
    form.video.value = exercicio.video || ''
    form.obs.value = exercicio.obs || ''
  }

  form.onsubmit = (e) => {
    e.preventDefault()
    const novo = { nome: form.nome.value.trim(), grupo: form.grupo.value.trim(), video: form.video.value.trim(), obs: form.obs.value.trim(), feito: exercicio?.feito || false }
    if (state.editingIndex !== null) {
      state.dados[state.dia][state.editingIndex] = novo
      state.editingIndex = null
    } else {
      state.dados[state.dia].push(novo)
    }
    salvar()
    modalRoot.innerHTML = ''
    render()
  }

  cancelar.onclick = () => { modalRoot.innerHTML = '' }

  overlay.appendChild(box)
  modalRoot.appendChild(overlay)
}

addBtn.onclick = () => { state.editingIndex = null; openModal(null) }

function renderSummary() {
  const exercicios = state.dados[state.dia]
  const feitos = exercicios.filter(ex => ex.feito).length
  const total = exercicios.length
  const percent = total > 0 ? Math.round((feitos / total) * 100) : 0

  summaryEl.innerHTML = `
    <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-8 max-w-2xl mx-auto shadow-lg border border-gray-700/40 text-center">
      <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-6 uppercase tracking-wide">📊 Progresso do Dia</h2>
      <div class="space-y-5">
        <div class="flex justify-between items-center">
          <span class="text-gray-300 font-bold uppercase tracking-wider">Exercícios Feitos:</span>
          <span class="text-3xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">${feitos} / ${total}</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-4 border border-purple-500/30 overflow-hidden">
          <div class="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 h-4 rounded-full" style="width: ${percent}%"></div>
        </div>
        <div class="text-center"><span class="text-4xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">${percent}%</span></div>
      </div>
    </div>`
}

function contarMetasDoMes(mes, year) {
  const mesAno = `${year}-${String(mes + 1).padStart(2, '0')}`;
  let total = 0;

  if (state.historico && typeof state.historico === 'object') {
    Object.entries(state.historico).forEach(([chave, valor]) => {
      if (chave.startsWith(mesAno) && Array.isArray(valor)) {
        total += valor.length;
      }
    });
  }

  return total;
}

function getMetasDoMes(mes, year) {
  const mesAno = `${year}-${String(mes + 1).padStart(2, '0')}`;
  const metas = {
    Segunda: [],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: []
  };

  if (state.historico && typeof state.historico === 'object') {
    Object.entries(state.historico).forEach(([chave, valor]) => {
      if (chave.startsWith(mesAno) && Array.isArray(valor)) {
        valor.forEach(meta => {
          if (meta.dia && metas[meta.dia]) {
            metas[meta.dia].push(meta);
          }
        });
      }
    });
  }

  return metas;
}

function renderMonthlyStats() {
  const ano = new Date().getFullYear()
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  mensalView.innerHTML = ''
  const seletor = document.createElement('div')
  seletor.className = 'flex justify-center gap-4 mb-8'
  seletor.innerHTML = `<span class="text-white text-2xl font-bold">${ano}</span>`
  mensalView.appendChild(seletor)

  const grid = document.createElement('div')
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'

  meses.forEach((mes, index) => {
    const metas = getMetasDoMes(index, ano)
    const totalMetas = contarMetasDoMes(index, ano)
    const div = document.createElement('div')
    div.className = 'bg-gray-800/60 rounded-xl p-6 border border-gray-700/40 shadow-lg'
    div.innerHTML = `
      <div class="mb-4 pb-4 border-b border-gray-700/40"><h3 class="text-2xl font-black text-white mb-1">${mes}</h3><p class="text-purple-400 font-bold text-lg">🎯 ${totalMetas} metas cumpridas</p></div>
      <div class="space-y-2">${['Segunda','Terça','Quarta','Quinta','Sexta'].map(d => `<div class="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg"><span class="text-gray-300 font-semibold">${d}</span><div>${metas[d] > 0 ? `<span class="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-lg font-bold text-sm">✓ ${metas[d]}</span>` : `<span class="text-gray-500 text-sm">—</span>`}</div></div>`).join('')}</div>
      <div class="mt-4 pt-4 border-t border-gray-700/40"><div class="flex justify-between items-center mb-2"><span class="text-gray-300 text-sm font-semibold">Taxa de conclusão:</span><span class="text-cyan-400 font-bold">${totalMetas > 0 ? Math.round((totalMetas / (5 * 4)) * 100) : 0}%</span></div><div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style="width: ${Math.min((totalMetas / (5 * 4)) * 100, 100)}%"></div></div></div>
    `
    grid.appendChild(div)
  })

  mensalView.appendChild(grid)
}

function render() {
  renderTabs(); renderGrid(); renderSummary();
}

render();
