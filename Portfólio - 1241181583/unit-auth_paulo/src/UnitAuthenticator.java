import java.util.Scanner;

public class UnitAuthenticator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        TabelaHash sistema = new TabelaHash(10); // Tabela hash com tamanho 10
        int opcao;

        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║      UNIT AUTHENTICATOR SYSTEM         ║");
        System.out.println("║   Sistema de Autenticação de Usuários  ║");
        System.out.println("╚════════════════════════════════════════╝\n");

        do {
            exibirMenu();
            opcao = scanner.nextInt();
            scanner.nextLine(); // Limpar buffer

            switch (opcao) {
                case 1:
                    realizarInsercao(scanner, sistema);
                    break;
                case 2:
                    realizarRemocao(scanner, sistema);
                    break;
                case 3:
                    realizarBusca(scanner, sistema);
                    break;
                case 4:
                    realizarLogin(scanner, sistema);
                    break;
                case 5:
                    System.out.println("\nEncerrando o sistema...");
                    System.out.println("Obrigado por usar o Unit Authenticator!");
                    break;
                default:
                    System.out.println("\nOpção inválida! Tente novamente.\n");
            }
        } while (opcao != 5);

        scanner.close();
    }

    private static void exibirMenu() {
        System.out.println("┌────────────────────────────────────────┐");
        System.out.println("│              MENU PRINCIPAL            │");
        System.out.println("├────────────────────────────────────────┤");
        System.out.println("│  1. Inserção                           │");
        System.out.println("│  2. Remoção                            │");
        System.out.println("│  3. Busca                              │");
        System.out.println("│  4. Login                              │");
        System.out.println("│  5. Sair                               │");
        System.out.println("└────────────────────────────────────────┘");
        System.out.print("Escolha uma opção: ");
    }

    private static void realizarInsercao(Scanner scanner, TabelaHash sistema) {
        System.out.println("\n--- CADASTRO DE USUÁRIO ---");
        System.out.print("Digite o nome do usuário: ");
        String nome = scanner.nextLine();
        System.out.print("Digite a senha: ");
        String senha = scanner.nextLine();
        sistema.inserir(nome, senha);
        System.out.println();
    }

    private static void realizarRemocao(Scanner scanner, TabelaHash sistema) {
        System.out.println("\n--- REMOÇÃO DE USUÁRIO ---");
        System.out.print("Digite o nome do usuário a ser removido: ");
        String nome = scanner.nextLine();
        sistema.remover(nome);
        System.out.println();
    }

    private static void realizarBusca(Scanner scanner, TabelaHash sistema) {
        System.out.println("\n--- BUSCA DE USUÁRIO ---");
        System.out.print("Digite o nome do usuário: ");
        String nome = scanner.nextLine();
        sistema.buscar(nome);
        System.out.println();
    }

    private static void realizarLogin(Scanner scanner, TabelaHash sistema) {
        System.out.println("\n--- AUTENTICAÇÃO DE USUÁRIO ---");
        System.out.print("Digite o nome do usuário: ");
        String nome = scanner.nextLine();
        System.out.print("Digite a senha: ");
        String senha = scanner.nextLine();
        sistema.autenticar(nome, senha);
        System.out.println();
    }
}
