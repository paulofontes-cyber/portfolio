public class TabelaHash {
    private No[] tabela;
    private int tamanho;

    public TabelaHash(int tamanho) {
        this.tamanho = tamanho;
        this.tabela = new No[tamanho];
    }

    // Função hash para calcular o índice
    private int funcaoHash(String chave) {
        int hash = 0;
        for (int i = 0; i < chave.length(); i++) {
            hash += chave.charAt(i);
        }
        return hash % tamanho;
    }

    // Inserir novo usuário
    public boolean inserir(String nomeUsuario, String senha) {
        int indice = funcaoHash(nomeUsuario);
        
        // Verificar se o usuário já existe
        No atual = tabela[indice];
        while (atual != null) {
            if (atual.getChave().equals(nomeUsuario)) {
                System.out.println("Erro: Usuário já cadastrado!");
                return false;
            }
            atual = atual.getProximo();
        }

        // Inserir no início da lista (encadeamento)
        No novoNo = new No(nomeUsuario, senha);
        novoNo.setProximo(tabela[indice]);
        tabela[indice] = novoNo;
        System.out.println("Usuário cadastrado com sucesso!");
        return true;
    }

    // Buscar usuário
    public boolean buscar(String nomeUsuario) {
        int indice = funcaoHash(nomeUsuario);
        No atual = tabela[indice];

        while (atual != null) {
            if (atual.getChave().equals(nomeUsuario)) {
                System.out.println("Usuário encontrado: " + nomeUsuario);
                return true;
            }
            atual = atual.getProximo();
        }

        System.out.println("Usuário não encontrado!");
        return false;
    }

    // Autenticar usuário (login)
    public boolean autenticar(String nomeUsuario, String senha) {
        int indice = funcaoHash(nomeUsuario);
        No atual = tabela[indice];

        while (atual != null) {
            if (atual.getChave().equals(nomeUsuario)) {
                if (atual.getValor().equals(senha)) {
                    System.out.println("Login realizado com sucesso! Bem-vindo, " + nomeUsuario + "!");
                    return true;
                } else {
                    System.out.println("Senha incorreta!");
                    return false;
                }
            }
            atual = atual.getProximo();
        }

        System.out.println("Usuário não encontrado!");
        return false;
    }

    // Remover usuário
    public boolean remover(String nomeUsuario) {
        int indice = funcaoHash(nomeUsuario);
        No atual = tabela[indice];
        No anterior = null;

        while (atual != null) {
            if (atual.getChave().equals(nomeUsuario)) {
                if (anterior == null) {
                    // Remover o primeiro nó da lista
                    tabela[indice] = atual.getProximo();
                } else {
                    // Remover nó do meio ou fim da lista
                    anterior.setProximo(atual.getProximo());
                }
                System.out.println("Usuário removido com sucesso!");
                return true;
            }
            anterior = atual;
            atual = atual.getProximo();
        }

        System.out.println("Usuário não encontrado!");
        return false;
    }

    // Exibir todos os usuários (para fins de teste)
    public void exibirTodos() {
        System.out.println("\n=== Usuários Cadastrados ===");
        boolean temUsuarios = false;
        
        for (int i = 0; i < tamanho; i++) {
            No atual = tabela[i];
            if (atual != null) {
                System.out.print("Índice " + i + ": ");
                while (atual != null) {
                    System.out.print(atual.getChave() + " -> ");
                    atual = atual.getProximo();
                    temUsuarios = true;
                }
                System.out.println("null");
            }
        }
        
        if (!temUsuarios) {
            System.out.println("Nenhum usuário cadastrado.");
        }
        System.out.println("============================\n");
    }
}
