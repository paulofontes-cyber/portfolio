document.addEventListener("DOMContentLoaded", () => {
 
  const entradaTarefa = document.getElementById("entrada-tarefa");
  const botaoAdicionar = document.getElementById("botao-adicionar");
  const containersTarefas = document.querySelectorAll(".container-tarefas");
  const contadores = {
    "em-aberto": document.getElementById("contador-em-aberto"),
    "bid": document.getElementById("contador-bid"),
    "em-andamento": document.getElementById("contador-em-andamento"),
    "entregue": document.getElementById("contador-entregue")
  };

 
  let tarefas = [];
  let tarefaArrastada = null;

  
  function carregarTarefas() {
    
    renderizarTarefas();
  }

  
  function salvarTarefas() {
    
    console.log("Tarefas salvas:", tarefas);
  }

  
  function renderizarTarefas() {
  
    containersTarefas.forEach((container) => {
      container.innerHTML = "";
    });

  
    const contagem = {
      "em-aberto": 0,
      "bid": 0,
      "em-andamento": 0,
      "entregue": 0
    };

    
    tarefas.forEach((tarefa) => {
      const elementoTarefa = criarElementoTarefa(tarefa);
      document.getElementById(tarefa.coluna).appendChild(elementoTarefa);
      contagem[tarefa.coluna]++;
    });

    
    Object.keys(contagem).forEach(coluna => {
      if (contadores[coluna]) {
        contadores[coluna].textContent = contagem[coluna];
      }
    });
  }

 
  function criarElementoTarefa(tarefa) {
    const elementoTarefa = document.createElement("div");
    elementoTarefa.className = `cartao-tarefa ${tarefa.coluna}`;
    elementoTarefa.setAttribute("draggable", "true");
    elementoTarefa.setAttribute("data-id", tarefa.id);

    
    const elementoConteudo = document.createElement("div");
    elementoConteudo.className = "conteudo-tarefa";
    elementoConteudo.textContent = tarefa.conteudo;

   
    const elementoRodape = document.createElement("div");
    elementoRodape.className = "rodape-tarefa";

    
    const elementoEtiqueta = document.createElement("span");
    elementoEtiqueta.className = `etiqueta-tarefa ${tarefa.coluna}`;
    elementoEtiqueta.textContent = obterRotuloColuna(tarefa.coluna);

   
    const botaoExcluir = document.createElement("button");
    botaoExcluir.className = "botao-excluir";
    botaoExcluir.innerHTML = "×";
    botaoExcluir.setAttribute("aria-label", "Excluir tarefa");
    botaoExcluir.addEventListener("click", (evento) => {
      evento.stopPropagation();
      excluirTarefa(tarefa.id);
    });

   
    elementoTarefa.appendChild(elementoConteudo);
    elementoTarefa.appendChild(elementoRodape);
    elementoRodape.appendChild(elementoEtiqueta);
    elementoTarefa.appendChild(botaoExcluir);

    
    elementoTarefa.addEventListener("dragstart", manipularInicioArrasro);
    elementoTarefa.addEventListener("dragend", manipularFimArrasto);

    return elementoTarefa;
  }

  
  function obterRotuloColuna(coluna) {
    const rotulos = {
      "em-aberto": "Aberto",
      "bid": "Negociação",
      "em-andamento": "Andamento",
      "entregue": "Concluído"
    };
    return rotulos[coluna] || "";
  }

  
  function adicionarTarefa() {
    const conteudo = entradaTarefa.value.trim();
    if (conteudo === "") {
      entradaTarefa.focus();
      return;
    }

    const novaTarefa = {
      id: Date.now().toString(),
      conteudo: conteudo,
      coluna: "em-aberto",
      criadaEm: new Date().toISOString(),
    };

    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();

    
    entradaTarefa.value = "";
    entradaTarefa.focus();

   
    const novaTarefaElemento = document.querySelector(`[data-id="${novaTarefa.id}"]`);
    if (novaTarefaElemento) {
      novaTarefaElemento.style.transform = "scale(1.05)";
      setTimeout(() => {
        novaTarefaElemento.style.transform = "";
      }, 200);
    }
  }

  
  function excluirTarefa(idTarefa) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      tarefas = tarefas.filter((tarefa) => tarefa.id !== idTarefa);
      salvarTarefas();
      renderizarTarefas();
    }
  }

  
  function moverTarefa(idTarefa, colunaDestino) {
    tarefas = tarefas.map((tarefa) => {
      if (tarefa.id === idTarefa) {
        return { 
          ...tarefa, 
          coluna: colunaDestino,
          atualizadaEm: new Date().toISOString()
        };
      }
      return tarefa;
    });

    salvarTarefas();
    renderizarTarefas();
  }

  
  function manipularInicioArrasro(evento) {
    tarefaArrastada = evento.target;
    evento.dataTransfer.effectAllowed = "move";
    evento.dataTransfer.setData("text/plain", evento.target.getAttribute("data-id"));
    
    setTimeout(() => {
      evento.target.classList.add("arrastando");
    }, 0);
  }

  function manipularFimArrasto(evento) {
    evento.target.classList.remove("arrastando");
    tarefaArrastada = null;
  }

  
  containersTarefas.forEach((container) => {
    container.addEventListener("dragover", (evento) => {
      evento.preventDefault();
      evento.dataTransfer.dropEffect = "move";
    });

    container.addEventListener("dragenter", function (evento) {
      evento.preventDefault();
      this.classList.add("arrastando-sobre");
    });

    container.addEventListener("dragleave", function (evento) {
     
      if (!this.contains(evento.relatedTarget)) {
        this.classList.remove("arrastando-sobre");
      }
    });

    container.addEventListener("drop", function (evento) {
      evento.preventDefault();
      this.classList.remove("arrastando-sobre");

      const idTarefa = evento.dataTransfer.getData("text/plain");
      const colunaDestino = this.id;

      if (idTarefa && colunaDestino) {
        moverTarefa(idTarefa, colunaDestino);
        
      
        const tarefaMovida = document.querySelector(`[data-id="${idTarefa}"]`);
        if (tarefaMovida) {
          tarefaMovida.style.transform = "scale(1.02)";
          setTimeout(() => {
            tarefaMovida.style.transform = "";
          }, 300);
        }
      }
    });
  });

 
  botaoAdicionar.addEventListener("click", adicionarTarefa);

  
  entradaTarefa.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      adicionarTarefa();
    }
  });

  
  entradaTarefa.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      entradaTarefa.blur();
    }
  });

 
  function adicionarTarefasExemplo() {
    const exemplos = [
      { conteudo: "Revisar proposta comercial", coluna: "em-aberto" },
      { conteudo: "Reunião com cliente ABC", coluna: "bid" },
      { conteudo: "Desenvolver módulo de relatórios", coluna: "em-andamento" },
      { conteudo: "Entrega do projeto XYZ", coluna: "entregue" }
    ];

    exemplos.forEach((exemplo, index) => {
      const tarefa = {
        id: `exemplo-${Date.now()}-${index}`,
        conteudo: exemplo.conteudo,
        coluna: exemplo.coluna,
        criadaEm: new Date().toISOString()
      };
      tarefas.push(tarefa);
    });

    salvarTarefas();
    renderizarTarefas();
  }

 
  function limparTodasTarefas() {
    if (confirm("Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita.")) {
      tarefas = [];
      salvarTarefas();
      renderizarTarefas();
    }
  }

  
  function exportarTarefas() {
    const dadosExportacao = {
      tarefas: tarefas,
      exportadoEm: new Date().toISOString(),
      versao: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], { 
      type: "application/json" 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tarefas-kanban-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

 
  function importarTarefas(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function(e) {
      try {
        const dados = JSON.parse(e.target.result);
        if (dados.tarefas && Array.isArray(dados.tarefas)) {
          if (confirm("Importar tarefas irá substituir todas as tarefas atuais. Continuar?")) {
            tarefas = dados.tarefas;
            salvarTarefas();
            renderizarTarefas();
            alert("Tarefas importadas com sucesso!");
          }
        } else {
          alert("Formato de arquivo inválido!");
        }
      } catch (erro) {
        alert("Erro ao ler o arquivo: " + erro.message);
      }
    };
    leitor.readAsText(arquivo);
  }

  
  function buscarTarefas(termo) {
    const termoLower = termo.toLowerCase();
    const tarefasFiltradas = tarefas.filter(tarefa => 
      tarefa.conteudo.toLowerCase().includes(termoLower)
    );

   
    containersTarefas.forEach((container) => {
      container.innerHTML = "";
    });

    const contagem = {
      "em-aberto": 0,
      "bid": 0,
      "em-andamento": 0,
      "entregue": 0
    };

    tarefasFiltradas.forEach((tarefa) => {
      const elementoTarefa = criarElementoTarefa(tarefa);
      
      const conteudoElemento = elementoTarefa.querySelector('.conteudo-tarefa');
      if (termo) {
        const regex = new RegExp(`(${termo})`, 'gi');
        conteudoElemento.innerHTML = conteudoElemento.textContent.replace(regex, '<mark>$1</mark>');
      }
      
      document.getElementById(tarefa.coluna).appendChild(elementoTarefa);
      contagem[tarefa.coluna]++;
    });

    
    Object.keys(contagem).forEach(coluna => {
      if (contadores[coluna]) {
        contadores[coluna].textContent = contagem[coluna];
      }
    });
  }

 
  document.addEventListener("keydown", (evento) => {
   
    if (evento.ctrlKey && evento.key === "n") {
      evento.preventDefault();
      entradaTarefa.focus();
    }
    
   
    if (evento.ctrlKey && evento.key === "e") {
      evento.preventDefault();
      exportarTarefas();
    }
    
   
    if (evento.ctrlKey && evento.key === "l") {
      evento.preventDefault();
      limparTodasTarefas();
    }
  });

 
  function mostrarEstatisticas() {
    const total = tarefas.length;
    const porColuna = tarefas.reduce((acc, tarefa) => {
      acc[tarefa.coluna] = (acc[tarefa.coluna] || 0) + 1;
      return acc;
    }, {});

    const porcentagens = Object.keys(porColuna).map(coluna => {
      const porcentagem = total > 0 ? ((porColuna[coluna] / total) * 100).toFixed(1) : 0;
      return `${obterRotuloColuna(coluna)}: ${porColuna[coluna]} (${porcentagem}%)`;
    });

    alert(`Estatísticas do Quadro Kanban:\n\nTotal de tarefas: ${total}\n\n${porcentagens.join('\n')}`);
  }

  
  function adicionarControles() {
    const containerControles = document.createElement('div');
    containerControles.className = 'controles-adicionais';
    containerControles.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    `;

    const botoes = [
      { texto: '📊', titulo: 'Estatísticas', acao: mostrarEstatisticas },
      { texto: '📤', titulo: 'Exportar', acao: exportarTarefas },
      { texto: '🗑️', titulo: 'Limpar Tudo', acao: limparTodasTarefas },
      { texto: '📝', titulo: 'Exemplos', acao: adicionarTarefasExemplo }
    ];

    botoes.forEach(botao => {
      const elemento = document.createElement('button');
      elemento.textContent = botao.texto;
      elemento.title = botao.titulo;
      elemento.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--fundo-gradiente, linear-gradient(135deg, #667eea, #764ba2));
        color: white;
        cursor: pointer;
        font-size: 18px;
        box-shadow: var(--sombra-media, 0 4px 6px rgba(0,0,0,0.1));
        transition: all 0.2s ease;
      `;
      
      elemento.addEventListener('click', botao.acao);
      elemento.addEventListener('mouseenter', () => {
        elemento.style.transform = 'scale(1.1)';
      });
      elemento.addEventListener('mouseleave', () => {
        elemento.style.transform = 'scale(1)';
      });
      
      containerControles.appendChild(elemento);
    });

    document.body.appendChild(containerControles);
  }

  
  carregarTarefas();
  
  
  setTimeout(() => {
    entradaTarefa.focus();
  }, 100);

 
  
  window.kanbanDebug = {
    tarefas: () => tarefas,
    adicionarExemplos: adicionarTarefasExemplo,
    limparTudo: limparTodasTarefas,
    exportar: exportarTarefas,
    estatisticas: mostrarEstatisticas
  };

  console.log("Sistema Kanban inicializado com sucesso!");
  console.log("Atalhos disponíveis:");
  console.log("- Ctrl + N: Focar no campo de nova tarefa");
  console.log("- Ctrl + E: Exportar tarefas");
  console.log("- Ctrl + L: Limpar todas as tarefas");
  console.log("- Enter: Adicionar nova tarefa (quando o campo estiver focado)");
});