
# Gerador de Termos (MikeDelta)

Módulo customizado para Drupal 10 desenvolvido para automatizar, padronizar e modernizar a geração de Termos para o pessoal de TI (TRE, TRI e TRPVM) em conformidade com as normas de Segurança da Informação em vigor na MB.

## 🚀 Funcionalidades

* **Processamento Client-Side:** Toda a injeção de dados e geração do PDF ocorre via JavaScript (`jsPDF`) diretamente no navegador do usuário, garantindo rapidez e evitando o tráfego de dados sensíveis no servidor.
* **Suporte a Múltiplas Hierarquias:** Regras de negócio dinâmicas adaptadas para Oficiais, Praças e Servidores Civis.
* **Validação de Militares Temporários:** Regras estritas (baseadas no Mapa de Classes) que habilitam ou bloqueiam opções de RM1, RM2 e RM3, injetando as siglas automaticamente no documento final.
* **Máscaras Dinâmicas:** Formatação em tempo real que alterna entre NIP (10 dígitos) para militares e CPF (14 dígitos) para servidores civis.
* **Instalação Plug-and-Play:** O módulo já contém as configurações e redações padrão (`config/install`), dispensando configurações manuais complexas após a ativação.

## ⚙️ Requisitos

* **Drupal:** 10.x (Homologado na versão 10.5.1)
* **PHP:** 8.1 ou superior
* **Dependências JS:** Nenhuma.

## 📦 Instalação

1.  Faça o download do módulo ou clone o repositório para o diretório de módulos customizados da sua OM:
    `../modules/custom/mikedelta_termos`
2.  Acesse o painel administrativo do Drupal em **Extensões** (`/admin/modules`).
3.  Localize o módulo **MikeDelta Termos** e marque a caixa de seleção.
4.  Clique em **Instalar**. As configurações e textos padrão serão injetados no banco de dados automaticamente.

## 🖥️ Como Usar

### Para o Usuário Final
Acesse a rota configurada (ex: `/gerador-termos`). O formulário dinâmico guiará o preenchimento, aplicando validações de patentes e formatando o documento. Ao clicar em "Gerar PDF", o download iniciará automaticamente e a tela será reiniciada por segurança.

### Para o Administrador
Caso precise alterar o texto de algum termo ou a lista de softwares padrão do TRE:
1. Acesse **Configurações > Criação de Conteúdo > MikeDelta Termos** (`/admin/config/system/mikedelta_termos`).
2. Edite os textos necessários utilizando as variáveis permitidas (ex: `[NOME_COMPLETO]`, `[IP]`, `[MAC_ADDRESS]`).
3. Clique em **Salvar**. A alteração terá efeito imediato para todos os novos termos gerados.

---
**Nota de Segurança:** Este módulo foi desenvolvido seguindo boas práticas de isolamento visual (Flexbox/CSS próprio), garantindo compatibilidade com qualquer tema sem quebrar a interface de preenchimento.