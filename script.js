// Adicionar mais estrelas dinamicamente
        function criarEstrelasMalucas() {
            const chuvaDeEstrelas = document.querySelector('.chuva-de-estrelas');
            
            for (let i = 0; i < 20; i++) {
                const estrela = document.createElement('div');
                estrela.className = 'estrelinha-perdida';
                estrela.style.top = Math.random() * 100 + '%';
                estrela.style.left = Math.random() * 100 + '%';
                estrela.style.width = (Math.random() * 3 + 1) + 'px';
                estrela.style.height = estrela.style.width;
                estrela.style.animationDelay = Math.random() * 3 + 's';
                chuvaDeEstrelas.appendChild(estrela);
            }
        }

        // Efeito de scroll suave para os cartões
        function observarCartoes() {
            const cartoes = document.querySelectorAll('.cartao-nave-espacial');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'aparecer-do-nada 0.8s ease-out forwards';
                    }
                });
            });

            cartoes.forEach(cartao => {
                observer.observe(cartao);
            });
        }

        // Funcionalidade do formulário
        document.getElementById('formulario-cosmico').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.style.display = 'block';
            
            // Limpar formulário após 2 segundos
            setTimeout(() => {
                this.reset();
                mensagemSucesso.style.display = 'none';
            }, 3000);
        });

        // Efeito de brilho nos campos quando digitando
        const inputs = document.querySelectorAll('.input-da-digitacao-sagrada, .textarea-dos-pensamentos-profundos');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    this.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.6)';
                } else {
                    this.style.boxShadow = '';
                }
            });
        });

         // Efeito de paralaxe suave nos cartões
        function aplicarEfeitoParalaxe() {
            const cartoes = document.querySelectorAll('.cartao-da-recomendacao-dourada');
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                
                cartoes.forEach((cartao, index) => {
                    const velocidade = (index % 2 === 0) ? 0.5 : -0.3;
                    const yPos = scrollTop * velocidade;
                    cartao.style.transform = `translateY(${yPos}px)`;
                });
            });
        }

        // Animação de contador crescente
        function animarContador() {
            const contador = document.querySelector('.numero-magico-de-recomendacoes');
            const numeroFinal = 15;
            let numeroAtual = 0;
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const intervalo = setInterval(() => {
                        numeroAtual++;
                        contador.textContent = numeroAtual + '+';
                        
                        if (numeroAtual >= numeroFinal) {
                            clearInterval(intervalo);
                        }
                    }, 100);
                    
                    observer.disconnect();
                }
            });
            
            observer.observe(contador);
        }
       // Criar mais cometas aleatórios
        function criarCometasAleatorios() {
            const footer = document.querySelector('.rodape-do-universo-digital');
            
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% de chance
                    const cometa = document.createElement('div');
                    cometa.className = 'cometa-decorativo';
                    cometa.textContent = '☄️';
                    cometa.style.top = Math.random() * 80 + '%';
                    footer.appendChild(cometa);
                    
                    // Remover o cometa após a animação
                    setTimeout(() => {
                        cometa.remove();
                    }, 10000);
                }
            }, 5000);
        }

        // Inicializar as funções quando a página carregar
        window.addEventListener('load', () => {
            criarEstrelasMalucas();
            observarCartoes();
        });