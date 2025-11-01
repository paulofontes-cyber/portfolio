public class TestesUnitAuthenticator {
    public static void main(String[] args) {
        System.out.println("╔════════════════════════════════════════════════════╗");
        System.out.println("║   TESTES DO SISTEMA UNIT AUTHENTICATOR             ║");
        System.out.println("╚════════════════════════════════════════════════════╝\n");

        TabelaHash sistema = new TabelaHash(10);

        // Teste 1: Inserção de usuários
        System.out.println("═══ TESTE 1: INSERÇÃO DE USUÁRIOS ═══");
        sistema.inserir("joao", "senha123");
        sistema.inserir("maria", "maria456");
        sistema.inserir("pedro", "pedro789");
        sistema.inserir("ana", "ana321");
        sistema.inserir("carlos", "carlos654");
        System.out.println();

        // Teste 2: Tentativa de inserir usuário duplicado
        System.out.println("═══ TESTE 2: INSERÇÃO DE USUÁRIO DUPLICADO ═══");
        sistema.inserir("joao", "outrasenha");
        System.out.println();

        // Teste 3: Exibir todos os usuários cadastrados
        System.out.println("═══ TESTE 3: EXIBIR TODOS OS USUÁRIOS ═══");
        sistema.exibirTodos();

        // Teste 4: Busca de usuários existentes
        System.out.println("═══ TESTE 4: BUSCA DE USUÁRIOS EXISTENTES ═══");
        sistema.buscar("maria");
        sistema.buscar("pedro");
        System.out.println();

        // Teste 5: Busca de usuário inexistente
        System.out.println("═══ TESTE 5: BUSCA DE USUÁRIO INEXISTENTE ═══");
        sistema.buscar("lucas");
        System.out.println();

        // Teste 6: Autenticação com credenciais corretas
        System.out.println("═══ TESTE 6: LOGIN COM CREDENCIAIS CORRETAS ═══");
        sistema.autenticar("joao", "senha123");
        sistema.autenticar("maria", "maria456");
        System.out.println();

        // Teste 7: Autenticação com senha incorreta
        System.out.println("═══ TESTE 7: LOGIN COM SENHA INCORRETA ═══");
        sistema.autenticar("joao", "senhaerrada");
        System.out.println();

        // Teste 8: Autenticação com usuário inexistente
        System.out.println("═══ TESTE 8: LOGIN COM USUÁRIO INEXISTENTE ═══");
        sistema.autenticar("usuario_nao_existe", "senha");
        System.out.println();

        // Teste 9: Remoção de usuário existente
        System.out.println("═══ TESTE 9: REMOÇÃO DE USUÁRIO EXISTENTE ═══");
        sistema.remover("pedro");
        sistema.exibirTodos();

        // Teste 10: Tentativa de remover usuário já removido
        System.out.println("═══ TESTE 10: REMOÇÃO DE USUÁRIO JÁ REMOVIDO ═══");
        sistema.remover("pedro");
        System.out.println();

        // Teste 11: Verificar colisões (inserir usuários que geram mesmo hash)
        System.out.println("═══ TESTE 11: TESTE DE COLISÕES (ENCADEAMENTO) ═══");
        System.out.println("Inserindo usuários que podem gerar colisões...");
        sistema.inserir("abc", "senha1");
        sistema.inserir("bca", "senha2");
        sistema.inserir("cab", "senha3");
        sistema.exibirTodos();

        // Teste 12: Buscar usuários após colisão
        System.out.println("═══ TESTE 12: BUSCA APÓS COLISÕES ═══");
        sistema.buscar("abc");
        sistema.buscar("bca");
        sistema.buscar("cab");
        System.out.println();

        // Teste 13: Login após colisões
        System.out.println("═══ TESTE 13: LOGIN APÓS COLISÕES ═══");
        sistema.autenticar("abc", "senha1");
        sistema.autenticar("bca", "senha2");
        sistema.autenticar("cab", "senha3");
        System.out.println();

        // Teste 14: Remover usuário em lista com colisão
        System.out.println("═══ TESTE 14: REMOÇÃO EM LISTA COM COLISÃO ═══");
        sistema.remover("bca");
        sistema.exibirTodos();

        // Teste 15: Estado final do sistema
        System.out.println("═══ TESTE 15: ESTADO FINAL DO SISTEMA ═══");
        sistema.exibirTodos();

        System.out.println("╔════════════════════════════════════════════════════╗");
        System.out.println("║          TODOS OS TESTES FORAM CONCLUÍDOS          ║");
        System.out.println("╚════════════════════════════════════════════════════╝");
    }
}
