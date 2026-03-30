(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.mikeDeltaTermosGerador = {
    attach: function (context, settings) {
      
      // 1. Inicia a lógica que troca as opções de Posto/Graduação (Oficial vs Praça)
      bindCategoriaLogic(context);

      // 2. Evento do botão "Gerar PDF"
      $('#btn-gerar-pdf', context).once('bindClickGeradorTermos').on('click', function (e) {
        e.preventDefault();
        gerarDocumentoPDF(settings);
      });

    }
  };

  /**
   * Função que simula o comportamento do antigo scripts.js
   * Esconde/Mostra patentes baseando-se no botão radio Oficial/Praça
   */
  function bindCategoriaLogic(context) {
    $('.categoria-selector input', context).once('categoriaChange').on('change', function() {
        var categoria = $(this).val();
        var $posto = $('.posto-grad-select');
        var $quadro = $('#campo-quadro-espec');

        $posto.empty();
        $quadro.empty();

        if (categoria === 'oficial') {
            $posto.append(
                '<option value="AE">AE</option><option value="VA">VA</option><option value="CA">CA</option><option value="CMG">CMG</option><option value="CF">CF</option><option value="CC">CC</option><option value="CT">CT</option><option value="1T">1T</option><option value="2T">2T</option>');
            $quadro.append(
                '<option value="CA">CA</option><option value="T">T</option><option value="RM2-T">RM2-T</option><option value="FN">FN</option><option value="IM">IM</option><option value="MD">MD</option><option value="QC-CA">QC-CA</option><option value="AA">AA</option>');
        } else {
            $posto.append(
                '<option value="SO">SO</option><option value="1SG">1SG</option><option value="2SG">2SG</option><option value="3SG">3SG</option><option value="CB">CB</option><option value="MN">MN</option><option value="RM2">RM2</option>');
            $quadro.append(
                '<option value="OR">OR</option><option value="MR">MR</option><option value="EF">EF</option><option value="MO">MO</option><option value="CN">CN</option><option value="PL">PL</option><option value="PD">PD</option><option value="CP">CP</option><option value="Sem Esp">-</option>');
        }
    });

    // Dispara a verificação assim que a página carrega para preencher as opções corretamente
    $('.categoria-selector input:checked', context).trigger('change');
  }

  /**
   * Função principal de processamento do PDF
   */
  function gerarDocumentoPDF(settings) {
    // 1. Coleta o tipo de Termo (tre, tri, trpvm) que dita a regra
    var tipoTermo = $('.tipo-termo-selector input:checked').val();

    // 2. Coleta os dados pessoais
    var nomeCompleto = $('#campo-nome-completo').val().trim().toUpperCase();
    var nip = $('#campo-nip').val().trim();
    var postoGrad = $('#campo-posto-grad').val();
    var quadroEspec = $('#campo-quadro-espec').val();
    var om = $('#campo-om').val().trim().toUpperCase();

    // 3. Coleta os dados específicos do TRE (Se não for TRE, ficarão vazios, o que não tem problema)
    var macAddress = $('#campo-mac-address').val().trim();
    var nomeMaquina = $('#campo-nome-maquina').val().trim().toUpperCase();
    var ip = $('#campo-endereco-ip').val().trim();

    // Captura quais checkboxes de programas foram marcados
    var programasSelecionados = [];
    $('.checkboxes-programas input:checked').each(function() {
        // Coloca um hífen na frente de cada programa para criar uma lista no PDF
        programasSelecionados.push("- " + $(this).val()); 
    });
    var programasFormatados = programasSelecionados.length > 0 ? programasSelecionados.join('\n') : '- Nenhum programa extra selecionado.';

    // Validação Básica
    if (!nomeCompleto || !nip || !om) {
      alert('Atenção: Por favor, preencha todos os dados pessoais básicos.');
      return;
    }
    // Validação Extra se for TRE
    if (tipoTermo === 'tre' && (!macAddress || !nomeMaquina || !ip)) {
      alert('Atenção: Para o termo TRE, os dados de rede da máquina são obrigatórios.');
      return;
    }

    var textosPainel = settings.mikedelta_termos.textos;
    var textoBase = textosPainel[tipoTermo];

    if (!textoBase) {
      alert('Erro: O texto para este termo não foi configurado no painel de administração.');
      return;
    }

    // 4. Formata a data atual
    var dataObj = new Date();
    var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    var dia = dataObj.getDate();
    var mesExtenso = meses[dataObj.getMonth()];
    var ano = dataObj.getFullYear();
    var dataFormatada = dia + " de " + mesExtenso + " de " + ano;

    // 5. Mágica de Substituição de TODAS as variáveis de uma vez
    var textoProcessado = textoBase
      .replace(/\[POSTO_GRAD\]/g, postoGrad)
      .replace(/\[QUADRO_ESPEC\]/g, quadroEspec)
      .replace(/\[NOME_COMPLETO\]/g, nomeCompleto)
      .replace(/\[NIP\]/g, nip)
      .replace(/\[OM\]/g, om)
      .replace(/\[DATA_ATUAL\]/g, dataFormatada)
      .replace(/\[MAC_ADDRESS\]/g, macAddress)
      .replace(/\[IDENTIFICACAO_MAQUINA\]/g, nomeMaquina)
      .replace(/\[IP\]/g, ip)
      .replace(/\[PROGRAMAS_INSTALADOS\]/g, programasFormatados);

    // 6. Geração Física do PDF
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF('p', 'mm', 'a4');

    // Configurações de Margem
    var margemTop = 20;
    var margemLeft = 20;
    var larguraTexto = 170;
    var lineHeight = 5;

    // Cabeçalho e Título (Igual ao anterior)
    doc.setFont("Carlito", "bold");
    doc.setFontSize(12);
    doc.text("MARINHA DO BRASIL", 105, margemTop, { align: "center" });
    doc.text("SECRETARIA DA COMISSÃO DE PROMOÇÕES DE OFICIAIS", 105, margemTop + lineHeight, { align: "center" });
    doc.text(om, 105, margemTop + (lineHeight * 2), { align: "center" });
    
    var titulo = (tipoTermo === 'tre') ? "TERMO DE RECEBIMENTO DE ESTAÇÃO DE TRABALHO" : (tipoTermo === 'tri') ? "TERMO DE RESPONSABILIDADE INDIVIDUAL" : "TERMO DE RESPONSABILIDADE PORTAL/MÁQUINA VIRTUAL";
    doc.text(titulo, 105, margemTop + (lineHeight * 6), { align: "center" });

    // --- CORPO DO TEXTO ---
    doc.setFont("Carlito", "normal");
    // Se for TRE, removemos a tag [PROGRAMAS_INSTALADOS] do texto base para não duplicar com a tabela
    var textoParaRenderizar = textoProcessado.replace("[PROGRAMAS_INSTALADOS]", "");
    
    var linhasDoTexto = doc.splitTextToSize(textoParaRenderizar, larguraTexto);
    var posYAtual = margemTop + (lineHeight * 10);
    doc.text(linhasDoTexto, margemLeft, posYAtual, { align: "justify", maxWidth: larguraTexto });

    // --- TABELA DE PROGRAMAS (Apenas se for TRE) ---
    if (tipoTermo === 'tre') {
        var finalYCorpo = posYAtual + (linhasDoTexto.length * lineHeight) + 5;
        
        // Coleta os programas selecionados para as linhas da tabela
        var rows = [];
        $('.checkboxes-programas input:checked').each(function(index) {
            rows.push([index + 1, $(this).val(), 'Instalado']);
        });

        doc.autoTable({
            startY: finalYCorpo,
            margin: { left: margemLeft },
            head: [['Item', 'Software / Programa', 'Status']],
            body: rows,
            theme: 'grid',
            styles: { font: "Carlito", fontSize: 10 },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' }
        });
        
        // Atualiza a posição Y para a assinatura após a tabela
        posYAtual = doc.lastAutoTable.finalY + 15;
    } else {
        posYAtual = posYAtual + (linhasDoTexto.length * lineHeight) + 20;
    }

    // --- BLOCO DE ASSINATURA ---
    if (posYAtual > 250) { 
        doc.addPage();
        posYAtual = 30; 
    }

    doc.setFont("Carlito", "normal");
    doc.text("___________________________________________________", 105, posYAtual, { align: "center" });
    
    doc.setFont("Carlito", "bold");
    doc.text(nomeCompleto, 105, posYAtual + lineHeight, { align: "center" });
    
    doc.setFont("Carlito", "normal");
    var especialidadeFormatada = quadroEspec === "Sem Esp" ? "" : "(" + quadroEspec + ")";
    doc.text(postoGrad + especialidadeFormatada + " " + nip, 105, posYAtual + (lineHeight * 2), { align: "center" });
    
    doc.text("Rio de Janeiro, " + dataFormatada + ".", 105, posYAtual + (lineHeight * 6), { align: "center" });

    var nomeArquivo = tipoTermo.toUpperCase() + " " + postoGrad + especialidadeFormatada + " " + nip + " " + nomeCompleto + ".pdf";
    doc.save(nomeArquivo);
  }

})(jQuery, Drupal, drupalSettings);