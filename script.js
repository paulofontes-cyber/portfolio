
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

        
document.addEventListener('DOMContentLoaded', function() {
    const cartoesProjeto = document.querySelectorAll('.cartao-projeto-cosmico');
    
    cartoesProjeto.forEach(cartao => {
        cartao.addEventListener('mouseenter', function() {
            // Adiciona efeito de brilho extra
            this.style.boxShadow = '0 20px 60px rgba(0, 255, 255, 0.4), 0 0 50px rgba(106, 13, 173, 0.3)';
        });
        
        cartao.addEventListener('mouseleave', function() {
            // Remove efeito de brilho extra
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Efeito de loading para imagens
    const imagensProjeto = document.querySelectorAll('.imagem-projeto-espacial');
    
    imagensProjeto.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Define estado inicial
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        img.style.transition = 'all 0.6s ease';
    });
});



        // Inicializar as funções quando a página carregar
        window.addEventListener('load', () => {
            criarEstrelasMalucas();
            observarCartoes();
        });
