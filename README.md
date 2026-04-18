# MikeDelta Termos (Gerador de termos)

Módulo customizado para Drupal 10 desenvolvido para automatizar, padronizar e modernizar a geração de Termos de TI na MB (TRE, TRI e TRPVM) em conformidade com as normas de Segurança da Informação em vigor.

## 🚀 Funcionalidades

- **Processamento Client-Side:** Toda a injeção de dados e geração do PDF ocorre via JavaScript (`jsPDF`) diretamente no navegador do usuário, garantindo rapidez e evitando o tráfego de dados sensíveis no servidor.
- **Suporte a Múltiplas Hierarquias:** Regras de negócio dinâmicas adaptadas para Oficiais, Praças e Servidores Civis.
- **Validação de Militares Temporários:** Regras estritas (baseadas no Mapa de Classes) que habilitam ou bloqueiam opções de RM1, RM2 e RM3, injetando as siglas automaticamente no documento final (ex: `(RM2-T)`, `(RM1-PD)`).
- **Máscaras Dinâmicas:** Formatação em tempo real que alterna entre NIP (10 dígitos) para militares e CPF (14 dígitos) para servidores civis.
* **Pré-visualização de Documentos:** Botão que abre um modal seguro com o texto do template selecionado, permitindo a leitura integral antes da geração do arquivo final.
- **Instalação Plug-and-Play:** O módulo já contém as configurações e textos padrões (`config/install`), dispensando configurações manuais complexas após a ativação.

## ⚙️ Requisitos

- **Drupal:** 10.x (Homologado na versão 10.5.1)
- **PHP:** 8.1 ou superior
- **Dependências JS:** Nenhuma. O módulo já embute internamente as bibliotecas necessárias para a geração do PDF.

## 📦 Instalação

1.  Faça o download do módulo ou clone o repositório para o diretório de módulos customizados da sua OM:
    `/<diretorio-site-drupal>/modules/mikedelta_termos`
2.  Acesse o painel administrativo do Drupal em **Extensões** (`/admin/modules`).
3.  Localize o módulo **MikeDelta Termos** e marque a caixa de seleção.
4.  Clique em **Instalar**. As configurações e textos padrão serão injetados no banco de dados automaticamente.

## 🖥️ Como Usar

### Para o Usuário Final

Acesse a rota configurada (ex: `/gerador-termos`). O formulário dinâmico guiará o preenchimento, aplicando validações de patentes e formatando o documento. O usuário terá à disposição duas ações principais:
1. **Pré-vusualizar Termo:** Abre uma janela flutuante com o texto padrão para leitura dos termos antes de gerar.
2. **Gerar PDF:** Após o preenchimento do formulário, onde haverá a coleta os dados. Será gerado o arquivo e iniciado o download do documento em PDF.

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

### [1.1.0] - 2026-04-18 - **Correções e Melhorias**

**Novidades**
- Correções de bugs.
- Adições de segurança no frontend para proteção do backend.
- Adicionado atalho para acesso das configurações no topo da página do gerador (apenas usuários logados).
- Adicionado schema padrão para garantir conformidade e evitar Fatal Errors de configuração no Drupal.
- Bloqueia o envio do formulário pela tecla "Enter" para evitar recarregamento acidental e perda de dados do militar.

### [1.0.0] - 2026-04-04 - **Lançamento Oficial**

**Novidades**
- Geração de Termos gerais para TI (TRE, TRI, TRPVM) em formato PDF `client-side` (processamento 100% no navegador).
- Novo Modal de **Pré-visualização** ("Ler Termo") para leitura do documento em tela antes da assinatura/geração.
- Formatação dos textos dos termos dentro das normas de Segurança da Informação em vigor na MB.
- Suporte completo a alteração dos textos e configurações dos termos conforme a necessidade da OM.
- Suporte a Servidores Civis com alternância automática e máscaras de identificação (NIP para CPF).
- Gestão inteligente de Militares Temporários (Carreira, RM1, RM2, RM3) com regras de restrição baseadas no Posto/Graduação.
- Injeção dinâmica da sigla de temporários (ex: RM2-T) no corpo do PDF e no nome do arquivo exportado.
- Checkbox mestre ("Marcar todos") para seleção rápida de programas instalados no termo TRE.
- Integração ao Menu de Ajuda oficial do Drupal para rápida consulta das funcionalidades pelo administrador.
- Arquivo de instalação (`config/install/mikedelta_termos.settings.yml`), permitindo preenchimento automático universal dos textos padrões em novas instalações.
- Reset automático do formulário após o download bem-sucedido do documento.

**Melhorias de Interface e UX**
- Layout do formulário totalmente reestruturado com classes de Grid e Flexbox, garantindo interface responsiva.
- Tratamento avançado de parágrafos (`white-space: pre-wrap`) preservando as quebras de linha exatas tanto na Pré-Visualização quanto no arquivo final em PDF.

**Requisitos**
- **Drupal:** 10.x
- **PHP:** 8.1 ou superior
- **Dependências:** Nenhuma

## 🖥️ Downloads

- [mikedelta_termos-v1.1.0.zip](https://github.com/m4rcelodiasBR/mikedelta_termos/archive/refs/tags/v1.1.0.zip)
- [mikedelta_termos-v1.1.0.tar.gz](https://github.com/m4rcelodiasBR/mikedelta_termos/archive/refs/tags/v1.1.0.tar.gz)