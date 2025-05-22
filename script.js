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

        // Inicializar as funções quando a página carregar
        window.addEventListener('load', () => {
            criarEstrelasMalucas();
            observarCartoes();
        });