# DOCUMENTAÇÃO TÉCNICA - UNIT AUTHENTICATOR

## 1. INTRODUÇÃO

### 1.1 Contextualização

Em um mundo cada vez mais digitalizado, a segurança da informação tornou-se um dos maiores desafios para indivíduos e organizações. O aumento de ataques cibernéticos, fraudes e acessos não autorizados fez com que sistemas de autenticação se tornassem indispensáveis em praticamente todos os serviços online.

### 1.2 Objetivo

Este documento apresenta a implementação do sistema Unit Authenticator, um sistema de autenticação de usuários desenvolvido utilizando a estrutura de dados Tabela Hash com tratamento de colisões por encadeamento. O objetivo principal é demonstrar a aplicação prática de estruturas de dados na resolução de problemas reais de segurança da informação.

## 2. FUNDAMENTAÇÃO TEÓRICA

### 2.1 Tabela Hash

Uma tabela hash é uma estrutura de dados que implementa um tipo abstrato de dados associativo, permitindo o armazenamento e recuperação eficiente de pares chave-valor. A principal vantagem desta estrutura é a possibilidade de realizar operações de inserção, busca e remoção em tempo médio O(1).

### 2.2 Função Hash

A função hash é responsável por mapear uma chave para um índice na tabela. No sistema implementado, utiliza-se a seguinte função:

\`\`\`
h(chave) = (Σ ASCII(caractere)) mod tamanho_tabela
\`\`\`

Onde:
- ASCII(caractere) representa o valor ASCII de cada caractere da chave
- tamanho_tabela é o tamanho definido para a tabela hash (10 posições)

### 2.3 Tratamento de Colisões

Colisões ocorrem quando duas chaves diferentes produzem o mesmo índice através da função hash. O método de encadeamento (chaining) foi escolhido para tratar colisões, onde cada posição da tabela armazena uma lista ligada de elementos que compartilham o mesmo índice.

## 3. ARQUITETURA DO SISTEMA

### 3.1 Estrutura de Classes

O sistema foi desenvolvido seguindo os princípios de orientação a objetos e é composto por três classes principais:

#### 3.1.1 Classe No

Representa um nó da lista ligada utilizada no encadeamento. Cada nó armazena:
- **chave**: nome do usuário (String)
- **valor**: senha do usuário (String)
- **proximo**: referência para o próximo nó da lista (No)

#### 3.1.2 Classe TabelaHash

Implementa a estrutura de dados tabela hash com as seguintes características:
- **tabela**: array de nós (No[])
- **tamanho**: capacidade da tabela (int)

Métodos implementados:
- **funcaoHash(String chave)**: calcula o índice para uma chave
- **inserir(String nomeUsuario, String senha)**: cadastra novo usuário
- **buscar(String nomeUsuario)**: verifica existência de usuário
- **autenticar(String nomeUsuario, String senha)**: realiza login
- **remover(String nomeUsuario)**: remove usuário do sistema
- **exibirTodos()**: lista todos os usuários cadastrados

#### 3.1.3 Classe UnitAuthenticator

Classe principal que implementa a interface de usuário através de um menu interativo com cinco opções:
1. Inserção
2. Remoção
3. Busca
4. Login
5. Sair

### 3.2 Fluxo de Operações

#### 3.2.1 Inserção de Usuário

1. Recebe nome de usuário e senha
2. Calcula o índice através da função hash
3. Verifica se o usuário já existe na lista ligada daquele índice
4. Se não existir, insere no início da lista (encadeamento)
5. Retorna confirmação de sucesso ou erro

#### 3.2.2 Busca de Usuário

1. Recebe nome de usuário
2. Calcula o índice através da função hash
3. Percorre a lista ligada no índice calculado
4. Retorna verdadeiro se encontrar, falso caso contrário

#### 3.2.3 Autenticação (Login)

1. Recebe nome de usuário e senha
2. Calcula o índice através da função hash
3. Percorre a lista ligada buscando o usuário
4. Verifica se a senha corresponde
5. Retorna sucesso ou erro (usuário não encontrado ou senha incorreta)

#### 3.2.4 Remoção de Usuário

1. Recebe nome de usuário
2. Calcula o índice através da função hash
3. Percorre a lista ligada mantendo referência ao nó anterior
4. Remove o nó da lista ajustando os ponteiros
5. Retorna confirmação de sucesso ou erro

## 4. ANÁLISE DE COMPLEXIDADE

### 4.1 Complexidade Temporal

- **Melhor caso**: O(1) - quando não há colisões
- **Caso médio**: O(1 + α) - onde α é o fator de carga (n/m)
- **Pior caso**: O(n) - quando todos os elementos colidem no mesmo índice

### 4.2 Complexidade Espacial

O(n + m), onde:
- n é o número de elementos armazenados
- m é o tamanho da tabela (10 posições)

## 5. TESTES E VALIDAÇÃO

### 5.1 Bateria de Testes

Foram implementados 15 testes automatizados que cobrem:

1. **Testes de Inserção**:
   - Inserção de múltiplos usuários
   - Tentativa de inserção de usuário duplicado

2. **Testes de Busca**:
   - Busca de usuários existentes
   - Busca de usuários inexistentes

3. **Testes de Autenticação**:
   - Login com credenciais corretas
   - Login com senha incorreta
   - Login com usuário inexistente

4. **Testes de Remoção**:
   - Remoção de usuário existente
   - Tentativa de remoção de usuário já removido

5. **Testes de Colisão**:
   - Inserção de usuários que geram colisões
   - Busca em listas com colisões
   - Login em listas com colisões
   - Remoção em listas com colisões

### 5.2 Resultados Esperados

Todos os testes demonstram o funcionamento correto do sistema, incluindo:
- Tratamento adequado de colisões através de encadeamento
- Validação de credenciais
- Prevenção de duplicação de usuários
- Remoção segura de elementos em listas ligadas

## 6. CONCLUSÃO

O sistema Unit Authenticator foi implementado com sucesso, atendendo a todos os requisitos especificados. A utilização de tabela hash com encadeamento demonstrou-se eficiente para o gerenciamento de usuários e senhas, proporcionando operações rápidas de inserção, busca, autenticação e remoção.

A implementação em Java seguiu boas práticas de programação orientada a objetos, com código limpo, bem estruturado e totalmente em português conforme solicitado. O sistema de testes automatizados garante a confiabilidade das operações e demonstra o correto funcionamento do tratamento de colisões.

Este projeto evidencia a importância das estruturas de dados na construção de sistemas seguros e eficientes, fundamentais para a proteção de informações em ambientes digitais.

## 7. REFERÊNCIAS

CORMEN, T. H. et al. Algoritmos: Teoria e Prática. 3. ed. Rio de Janeiro: Elsevier, 2012.

GOODRICH, M. T.; TAMASSIA, R. Estruturas de Dados e Algoritmos em Java. 5. ed. Porto Alegre: Bookman, 2013.

SZWARCFITER, J. L.; MARKENZON, L. Estruturas de Dados e seus Algoritmos. 3. ed. Rio de Janeiro: LTC, 2010.
