# Gerador de Termos (MikeDelta)

Módulo customizado para Drupal 10 desenvolvido para automatizar, padronizar e modernizar a geração de Termos de TI na MB (TRE, TRI e TRPVM) em conformidade com as normas de Segurança da Informação em vigor.

## 🚀 Funcionalidades

- **Processamento Client-Side:** Toda a injeção de dados e geração do PDF ocorre via JavaScript (`jsPDF`) diretamente no navegador do usuário, garantindo rapidez e evitando o tráfego de dados sensíveis no servidor.
- **Suporte a Múltiplas Hierarquias:** Regras de negócio dinâmicas adaptadas para Oficiais, Praças e Servidores Civis.
- **Validação de Militares Temporários:** Regras estritas (baseadas no Mapa de Classes) que habilitam ou bloqueiam opções de RM1, RM2 e RM3, injetando as siglas automaticamente no documento final (ex: `RM2-T`, `RM1-PD`).
- **Máscaras Dinâmicas:** Formatação em tempo real que alterna entre NIP (10 dígitos) para militares e CPF (14 dígitos) para servidores civis.
- **Instalação Plug-and-Play:** O módulo já contém as configurações e redações padrão (`config/install`), dispensando configurações manuais complexas após a ativação.

## ⚙️ Requisitos

- **Drupal:** 10.x (Homologado na versão 10.5.1)
- **PHP:** 8.1 ou superior
- **Dependências JS:** Nenhuma. O módulo já embute internamente as bibliotecas necessárias para a geração do PDF.

## 📦 Instalação

1.  Faça o download do módulo ou clone o repositório para o diretório de módulos customizados da sua OM:
    `/<diretorio-site-drupal>/modules/custom/mikedelta_termos`
2.  Acesse o painel administrativo do Drupal em **Extensões** (`/admin/modules`).
3.  Localize o módulo **MikeDelta Termos** e marque a caixa de seleção.
4.  Clique em **Instalar**. As configurações e textos padrão serão injetados no banco de dados automaticamente.

## 🖥️ Como Usar

### Para o Usuário Final

Acesse a rota configurada (ex: `/gerador-termos`). O formulário dinâmico guiará o preenchimento, aplicando validações de patentes e formatando o documento. Ao clicar em "Gerar Termo (PDF)", o download iniciará automaticamente e a tela será reiniciada por segurança.

### Para o Administrador

Caso precise alterar o texto padrão de algum termo ou a lista de softwares padrão do TRE:

1. Acesse **Configurações > Criação de Conteúdo > MikeDelta Termos** (`/admin/config/content/mikedelta_termos`).
2. Edite os textos necessários utilizando as variáveis permitidas (ex: `[NOME_COMPLETO]`, `[IP]`, `[MAC_ADDRESS]`).
3. Para o TRE, na lista de softwares, adicione linha a linha os programas que deseja que apareça no gerador de termos.
4. Clique em **Salvar**. A alteração terá efeito imediato para todos os novos termos gerados.

---

**Nota de Segurança:** Este módulo foi desenvolvido seguindo boas práticas de isolamento visual (Flexbox/CSS próprio), garantindo compatibilidade com qualquer tema sem quebrar a interface de preenchimento.

---

## 📜 Histórico de Versões

### [1.0.0] - 2026-04-01 - **Lançamento**

**Novidades**

- Geração de Termos gerais para TI (TRE, TRI, TRPVM) em formato PDF `client-side`.
- Formatação dos textos dos termos dentro das normas em vigor na MB.
- Suporte completo a alteração dos textos e configurações dos termos conforme necessidade.
- Suporte completo a Servidores Civis com alternância automática de NIP para CPF.
- Gestão de Militares Temporários (Carreira, RM1, RM2, RM3) com regras de restrição por patente.
- Injeção dinâmica da sigla de temporários no corpo do PDF e nome do arquivo.
- Checkbox para seleção de programas instalados para o termo do tipo TRE.
- Arquivo de instalação (`config/install/mikedelta_termos.settings.yml`) para preenchimento automático dos textos padrões em novas instalações.
- Reset automático do formulário após a geração bem-sucedida do documento.
- Menu de ajuda completo e simplificado para administração do módulo.
