# 🎫 HelpDesk Pro - Sistema de Chamados

> Sistema de gerenciamento de chamados técnicos desenvolvido com **HTML5, CSS3 e JavaScript puro**, sem frameworks ou dependências externas.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Sobre o Projeto

Aplicação CRUD completa para abertura, edição, filtro e exclusão de chamados técnicos. Os dados são persistidos no `localStorage` do navegador. Desenvolvido como projeto de portfólio para a área de **QA (Quality Assurance)**.

### ✨ Funcionalidades

- **CRUD completo**: criar, visualizar, editar e excluir chamados
- **Filtros combinados**: por status, prioridade, categoria e busca textual
- **Validação de formulário**: campos obrigatórios, min/max de caracteres
- **Persistência local**: dados salvos no `localStorage`
- **Contadores em tempo real**: chamados abertos, em andamento e concluídos
- **Modal com confirmação**: exclusão protegida por dialog de confirmação
- **Toasts de feedback**: notificações de sucesso, erro e info
- **Responsivo**: mobile-first, funciona em qualquer dispositivo
- **Acessibilidade**: ARIA labels, roles, navegação por teclado (ESC fecha modais)
- **Seed automático**: dados de exemplo na primeira visita

## 📁 Estrutura

```
chamados-system/
├── index.html    # Estrutura semântica HTML5
├── style.css     # Estilização com CSS Variables, Flexbox e Grid
├── app.js        # Lógica JS puro (CRUD, filtros, validação, localStorage)
└── README.md     # Documentação e guia de testes
```

## 🚀 Como Executar

```bash
# Opção 1: Abrir diretamente no navegador
# Basta abrir o arquivo index.html no navegador

# Opção 2: Servidor local (recomendado)
npx serve .
# ou
python3 -m http.server 8080
```

## 🎨 Design

- **Tema escuro** com paleta profissional (slate/blue)
- **CSS Variables** para consistência de design tokens
- **Transições suaves** em hover e interações
- **Badges coloridos** para status, prioridade e categoria

---

## 🧪 Guia de Testes para QA

### 1. Testes Manuais — Checklist de Casos de Teste

#### CT-001: Criar chamado com dados válidos
| Campo | Valor |
|---|---|
| **Pré-condição** | Sistema carregado |
| **Passos** | 1. Clicar "Novo Chamado" → 2. Preencher todos os campos → 3. Clicar "Criar Chamado" |
| **Resultado esperado** | Chamado aparece na lista, toast de sucesso exibido, contadores atualizados |

#### CT-002: Validação de campos obrigatórios
| Campo | Valor |
|---|---|
| **Passos** | 1. Clicar "Novo Chamado" → 2. Deixar campos vazios → 3. Clicar "Criar Chamado" |
| **Resultado esperado** | Mensagens de erro exibidas, campos inválidos destacados em vermelho |

#### CT-003: Validação de limite de caracteres
| Campo | Valor |
|---|---|
| **Passos** | 1. Título com menos de 3 caracteres → 2. Descrição com menos de 10 caracteres |
| **Resultado esperado** | Erros de validação específicos para cada campo |

#### CT-004: Editar chamado existente
| Campo | Valor |
|---|---|
| **Passos** | 1. Clicar ✏️ em um chamado → 2. Alterar título e status → 3. Salvar |
| **Resultado esperado** | Dados atualizados na lista, toast de "atualizado" |

#### CT-005: Excluir chamado com confirmação
| Campo | Valor |
|---|---|
| **Passos** | 1. Clicar 🗑️ → 2. Confirmar exclusão |
| **Resultado esperado** | Chamado removido, toast de exclusão, contadores atualizados |

#### CT-006: Cancelar exclusão
| Campo | Valor |
|---|---|
| **Passos** | 1. Clicar 🗑️ → 2. Clicar "Cancelar" |
| **Resultado esperado** | Chamado permanece na lista |

#### CT-007: Filtrar por status
| Campo | Valor |
|---|---|
| **Passos** | 1. Selecionar "Aberto" no filtro de status |
| **Resultado esperado** | Apenas chamados com status "Aberto" visíveis |

#### CT-008: Busca textual
| Campo | Valor |
|---|---|
| **Passos** | 1. Digitar parte do título ou ID de um chamado |
| **Resultado esperado** | Lista filtrada em tempo real |

#### CT-009: Filtros combinados
| Campo | Valor |
|---|---|
| **Passos** | 1. Selecionar status "Aberto" + prioridade "Alta" |
| **Resultado esperado** | Apenas chamados que atendem ambos os critérios |

#### CT-010: Estado vazio
| Campo | Valor |
|---|---|
| **Passos** | 1. Excluir todos os chamados OU aplicar filtro sem resultados |
| **Resultado esperado** | Mensagem "Nenhum chamado encontrado" exibida |

#### CT-011: Persistência no localStorage
| Campo | Valor |
|---|---|
| **Passos** | 1. Criar chamado → 2. Recarregar página (F5) |
| **Resultado esperado** | Chamado persiste após reload |

#### CT-012: Fechar modal com ESC
| Campo | Valor |
|---|---|
| **Passos** | 1. Abrir modal → 2. Pressionar tecla ESC |
| **Resultado esperado** | Modal fecha |

#### CT-013: Fechar modal clicando fora
| Campo | Valor |
|---|---|
| **Passos** | 1. Abrir modal → 2. Clicar na área escura fora do modal |
| **Resultado esperado** | Modal fecha |

#### CT-014: Responsividade mobile
| Campo | Valor |
|---|---|
| **Passos** | 1. Redimensionar janela para 375px de largura |
| **Resultado esperado** | Layout adaptado, filtros empilhados, cards legíveis |

---

### 2. Como Simular Testes Automatizados

#### Opção A: Testes com Cypress (E2E)

```bash
npm init -y
npm install cypress --save-dev
npx cypress open
```

Exemplo de teste (`cypress/e2e/chamados.cy.js`):

```javascript
describe('Sistema de Chamados', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.window().then(win => win.localStorage.clear());
    cy.reload();
  });

  it('deve criar um novo chamado', () => {
    cy.get('#btn-new-ticket').click();
    cy.get('#ticket-title').type('Bug no formulário de login');
    cy.get('#ticket-description').type('O formulário não valida email corretamente');
    cy.get('#ticket-category').select('bug');
    cy.get('#ticket-priority').select('alta');
    cy.get('#ticket-requester').type('Tester QA');
    cy.get('#btn-submit').click();
    cy.contains('Bug no formulário de login').should('be.visible');
    cy.get('.toast--success').should('be.visible');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('#btn-new-ticket').click();
    cy.get('#btn-submit').click();
    cy.get('.form-error').should('be.visible');
  });

  it('deve filtrar por status', () => {
    cy.get('#filter-status').select('aberto');
    cy.get('.badge--em_andamento').should('not.exist');
    cy.get('.badge--concluido').should('not.exist');
  });

  it('deve excluir chamado com confirmação', () => {
    cy.get('[data-action="delete"]').first().click();
    cy.get('#btn-confirm-delete').click();
    cy.get('.toast--error').should('contain', 'excluído');
  });
});
```

#### Opção B: Testes com Selenium (Python)

```bash
pip install selenium webdriver-manager
```

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("http://localhost:8080")

# Teste: criar chamado
driver.find_element(By.ID, "btn-new-ticket").click()
driver.find_element(By.ID, "ticket-title").send_keys("Teste Selenium")
driver.find_element(By.ID, "ticket-description").send_keys("Descrição do teste automatizado com Selenium")
# ... preencher demais campos
driver.find_element(By.ID, "btn-submit").click()

assert "Teste Selenium" in driver.page_source
driver.quit()
```

#### Opção C: Testes de API/Lógica com Jest (Unit)

```bash
npm install jest --save-dev
```

Teste da lógica isolada (`__tests__/utils.test.js`):

```javascript
// Simular a função generateId
function generateId() {
  return 'TK-' + String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 100)).padStart(2, '0');
}

describe('generateId', () => {
  test('deve gerar ID no formato TK-XXXXXXXX', () => {
    const id = generateId();
    expect(id).toMatch(/^TK-\d{8}$/);
  });

  test('deve gerar IDs únicos', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBeGreaterThan(90);
  });
});
```

---

### 3. Plano de Teste — Template BDD (Gherkin)

```gherkin
Funcionalidade: Gerenciamento de Chamados

  Cenário: Criar chamado válido
    Dado que estou na página principal
    Quando clico em "Novo Chamado"
    E preencho o título com "Erro no checkout"
    E preencho a descrição com "Carrinho não finaliza a compra"
    E seleciono a categoria "Bug"
    E seleciono a prioridade "Alta"
    E preencho o solicitante com "Ana QA"
    E clico em "Criar Chamado"
    Então o chamado "Erro no checkout" aparece na lista
    E uma notificação de sucesso é exibida

  Cenário: Validar campos obrigatórios
    Dado que o modal de novo chamado está aberto
    Quando clico em "Criar Chamado" sem preencher campos
    Então mensagens de erro são exibidas para cada campo

  Cenário: Filtrar chamados por prioridade
    Dado que existem chamados com diferentes prioridades
    Quando seleciono o filtro "Alta"
    Então apenas chamados com prioridade "Alta" são exibidos
```

---

## 🔧 Para o GitHub

- **Nome do repositório**: `helpdesk-pro-qa`
- **Descrição**: `🎫 Sistema de chamados (CRUD) com HTML, CSS e JS puro. Inclui checklist de testes manuais, exemplos de automação com Cypress/Selenium e cenários BDD. Projeto de portfólio QA.`

## 📄 Licença

Projeto de uso livre para fins educacionais e de portfólio.

---

**Desenvolvido como projeto de portfólio para QA Junior** 🧪
