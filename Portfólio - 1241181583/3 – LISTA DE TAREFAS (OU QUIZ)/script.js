const inputNovaTarefa = document.getElementById("novaTarefa")
const btnAdicionar = document.getElementById("btnAdicionar")
const listaTarefas = document.getElementById("listaTarefas")
const mensagemVazia = document.getElementById("mensagemVazia")

const tarefas = []

function adicionarTarefa() {
  const textoTarefa = inputNovaTarefa.value.trim()

  if (textoTarefa !== "") {
    tarefas.push(textoTarefa)
    inputNovaTarefa.value = ""
    atualizarInterface()
    inputNovaTarefa.focus()
  }
}

function removerTarefa(index) {
  tarefas.splice(index, 1)
  atualizarInterface()
}

function atualizarInterface() {
  listaTarefas.innerHTML = ""

  if (tarefas.length === 0) {
    mensagemVazia.classList.remove("escondido")
  } else {
    mensagemVazia.classList.add("escondido")

    tarefas.forEach((tarefa, index) => {
      const itemTarefa = document.createElement("div")
      itemTarefa.className = "item-tarefa"

      const textoTarefa = document.createElement("span")
      textoTarefa.className = "texto-tarefa"
      textoTarefa.textContent = tarefa

      const btnRemover = document.createElement("button")
      btnRemover.className = "botao-remover"
      btnRemover.innerHTML = '<svg class="icone-lixeira" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>'
      btnRemover.setAttribute("aria-label", "Remover tarefa")
      btnRemover.onclick = () => removerTarefa(index)

      itemTarefa.appendChild(textoTarefa)
      itemTarefa.appendChild(btnRemover)
      listaTarefas.appendChild(itemTarefa)
    })
  }
}

btnAdicionar.addEventListener("click", adicionarTarefa)

inputNovaTarefa.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    adicionarTarefa()
  }
})

atualizarInterface()

window.onload = () => {
  inputNovaTarefa.focus()
}