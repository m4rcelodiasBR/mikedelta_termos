# Mike Delta Termos

Um módulo customizado para Drupal 10 desenvolvido para a geração de Termos Oficiais (TRE, TRI, TRPVM) em formato PDF diretamente no navegador do usuário.

## 🚀 Funcionalidades

* **Geração Client-Side:** Utiliza a biblioteca `jsPDF` para processar e gerar o PDF diretamente na máquina do usuário, poupando espaço de armazenamento no servidor.
* **Pronto para Intranet (Offline):** Todas as bibliotecas JS (`jsPDF`, `AutoTable`) estão embutidas no módulo. Nenhuma requisição externa à internet é feita.
* **Integração de Tema:** O módulo não força estilos próprios. Ele herda o Bootstrap/CSS do tema frontend padrão do seu Drupal para os formulários de preenchimento, garantindo responsividade nativa.
* **Textos Configuráveis:** O administrador pode alterar o corpo de texto de cada termo via painel de administração do Drupal, utilizando variáveis dinâmicas (ex: `[NIP]`, `[NOME_COMPLETO]`), sem necessidade de alterar o código-fonte.

## 📁 Estrutura de Diretórios

O módulo deve ser colocado na pasta de módulos customizados da sua instalação Drupal:
`/modules/custom/mikedelta_termos`

## ⚙️ Instalação

1. Faça o download deste repositório e coloque no diretório `/modules/custom/` do seu projeto Drupal.
2. Acesse o painel administrativo do Drupal: `Extensões` (`/admin/modules`).
3. Procure por **Mike Delta Termos** na lista e marque a caixa de seleção.
4. Clique em **Instalar**.

## 🔧 Configuração

1. Vá para `Configurações > Sistema > Mike Delta Termos` (`/admin/config/system/mikedelta_termos`).
2. Utilize as caixas de texto para definir a redação padrão dos termos (TRE, TRI, etc.).
3. Utilize as tags correspondentes (ex: `[POSTO_GRAD]`, `[NOME_COMPLETO]`) onde deseja que os dados preenchidos pelo usuário sejam inseridos automaticamente.
4. Salve as configurações.

## 📄 Uso

Os usuários podem acessar a rota `/termos` (ou o link disponibilizado no menu do site) para preencher seus dados, selecionar o tipo de termo e clicar em "Gerar PDF". O download iniciará automaticamente.

## 📚 Bibliotecas Utilizadas

* [jsPDF](https://github.com/parallax/jsPDF) (MIT License)
* [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (MIT License)