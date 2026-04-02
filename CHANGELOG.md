# Changelog
Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-04-01

### Adicionado
- Suporte completo a Servidores Civis com alternância automática para CPF.
- Gestão de Militares Temporários (Carreira, RM1, RM2, RM3) com regras de restrição por patente.
- Injeção dinâmica da sigla de temporários (ex: RM2-T) no corpo do PDF e nome do arquivo.
- Checkbox mestre "Marcar/Desmarcar todos" para a lista de softwares do termo TRE.
- Arquivo de instalação (`config/install/mikedelta_termos.settings.yml`) para preenchimento automático das redações padrão em novas instalações.
- Reset automático do formulário após a geração bem-sucedida do documento.

### Modificado
- Layout do formulário reestruturado utilizando classes de Grid e Flexbox para interface responsiva.
- Rótulos e máscaras do campo de identificação alternam dinamicamente entre NIP (10 dígitos) e CPF (14 dígitos).

### Corrigido
- Expressão regular de limpeza de texto ajustada para preservar quebras de linha e parágrafos originais do PDF.
- Correção da tag `[CPF]` para preenchimento correto no texto base de servidores civis.
- Ajuste na lógica de impressão para evitar a exibição da string "Civil" e parênteses vazios `()` no rodapé de assinatura.
- Forçado ID personalizado no campo NIP/CPF para sincronização correta da `label` nativa do Drupal.