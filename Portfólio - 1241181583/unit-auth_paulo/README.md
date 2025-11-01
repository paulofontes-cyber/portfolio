

# 🧩 Unit Authenticator

Sistema de autenticação de usuários desenvolvido em     Java, utilizando uma     Tabela Hash     com     tratamento de colisões por encadeamento    .
O projeto demonstra, de forma prática, o uso de estruturas de dados para resolver problemas de autenticação de forma eficiente e organizada.

---

## 📁 Estrutura do Projeto

```
src/
├── No.java                          # Classe que representa um nó da lista encadeada
├── TabelaHash.java                  # Implementação da Tabela Hash com encadeamento
├── UnitAuthenticator.java           # Classe principal com menu interativo (CLI)
└── TestesUnitAuthenticator.java     # Conjunto de testes automatizados
```

---

## ⚙️ Como Compilar e Executar

### 🧱 Compilar todos os arquivos:

```bash
javac src/  .java
```

### ▶️ Executar o sistema interativo:

```bash
java -cp src UnitAuthenticator
```

### 🧪 Executar os testes automatizados:

```bash
java -cp src TestesUnitAuthenticator
```



## 🔐 Funcionalidades Principais

1.     Inserção     — Cadastra novos usuários com nome e senha
2.     Remoção     — Exclui usuários existentes do sistema
3.     Busca     — Verifica se um usuário está cadastrado
4.     Login     — Autentica usuários com base em nome e senha
5.     Sair     — Encerra o programa com segurança



## 🧠 Características Técnicas

       Estrutura de Dados:     Tabela Hash com encadeamento (lista ligada)
       Tratamento de Colisões:     Encadeamento separado
       Tamanho da Tabela:     10 posições fixas
       Função Hash:     Soma dos valores ASCII dos caracteres do nome do usuário, módulo o tamanho da tabela



## 🧾 Testes Implementados

O arquivo `TestesUnitAuthenticator.java` contém     15 casos de teste     que validam:

   Inserção e detecção de usuários duplicados
   Busca por usuários existentes e inexistentes
   Autenticação com credenciais válidas e inválidas
   Remoção de usuários da tabela
   Tratamento correto de colisões e encadeamento múltiplo
   Integridade das operações em listas com colisões



## 👨‍💻 Autor

Projeto desenvolvido como     atividade prática da disciplina de Estrutura de Dados i , com o objetivo de aplicar conceitos fundamentais de hashing, listas encadeadas e autenticação de usuários, - POR Paulo Fontes 



