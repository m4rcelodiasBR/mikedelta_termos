(function ($, once, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.mikeDeltaTermosGerador = {
    attach: function (context, settings) {
      
      $(once('categoriaChange', '.categoria-selector input', context)).on('change', function() {
        atualizarSelectsPatente($(this).val());
      });

      if ($('.categoria-selector input:checked', context).length) {
        atualizarSelectsPatente($('.categoria-selector input:checked', context).val());
      }

      $(once('nomeMaiusculo', '#campo-nome-completo', context)).on('input', function() {
        $(this).val($(this).val().toUpperCase());
      });

      $(once('omMaiusculo', '#campo-om', context)).on('input', function() {
        $(this).val($(this).val().toUpperCase());
      });

      $(once('macMask', '#campo-mac-address', context)).on('input', function() {
        var val = $(this).val().replace(/[^a-fA-F0-9]/ig, '');
        val = val.match(/.{1,2}/g)?.join('-') || '';
        $(this).val(val.toUpperCase());
      });

      $(once('nipMask', '#campo-nip', context)).on('input', function() {
        var val = $(this).val().replace(/\D/g, ''); 
        if (val.length > 6) {
          val = val.replace(/^(\d{2})(\d{4})(\d{0,2}).*/, '$1.$2.$3');
        } else if (val.length > 2) {
          val = val.replace(/^(\d{2})(\d{0,4}).*/, '$1.$2');
        }
        $(this).val(val);
      });

      $(once('bindClickGeradorTermos', '#btn-gerar-pdf', context)).on('click', function (e) {
        e.preventDefault();
        gerarDocumentoPDF(settings);
      });

    }
  };

  /**
   * Função Exclusiva para povoar os Selects baseada na escolha Oficial/Praça
   */
  function atualizarSelectsPatente(categoria) {
    var $posto = $('.posto-grad-select');
    var $quadro = $('#campo-quadro-espec');

    $posto.empty();
    $quadro.empty();

    if (categoria === 'oficial') {
      $posto.append('<option value="AE">AE</option><option value="VA">VA</option><option value="CA">CA</option><option value="CMG">CMG</option><option value="CF">CF</option><option value="CC">CC</option><option value="CT">CT</option><option value="1T">1T</option><option value="2T">2T</option>');
      $quadro.append('<option value="CA">CA</option><option value="T">T</option><option value="RM2-T">RM2-T</option><option value="FN">FN</option><option value="IM">IM</option><option value="MD">MD</option><option value="QC-CA">QC-CA</option><option value="AA">AA</option>');
    } else {
      $posto.append('<option value="SO">SO</option><option value="1SG">1SG</option><option value="2SG">2SG</option><option value="3SG">3SG</option><option value="CB">CB</option><option value="MN">MN</option><option value="RM2">RM2</option>');
      $quadro.append('<option value="OR">OR</option><option value="MR">MR</option><option value="EF">EF</option><option value="MO">MO</option><option value="CN">CN</option><option value="PL">PL</option><option value="PD">PD</option><option value="CP">CP</option><option value="Sem Esp">-</option>');
    }
  }

  /**
   * Função principal de processamento do PDF
   */
  function gerarDocumentoPDF(settings) {
    var tipoTermo = $('.tipo-termo-selector input:checked').val();
    var nomeCompleto = $('#campo-nome-completo').val().trim().toUpperCase();
    var nip = $('#campo-nip').val().trim();
    var postoGrad = $('.posto-grad-select').val();
    var quadroEspec = $('#campo-quadro-espec').val();
    
    var omPadrao = settings.mikedelta_termos.om_padrao || 'CPO';
    var omDigitada = $('#campo-om').val().trim();
    var om = omDigitada ? omDigitada.toUpperCase() : omPadrao.toUpperCase();

    var macAddress = $('#campo-mac-address').val().trim();
    var nomeMaquina = $('#campo-nome-maquina').val().trim().toUpperCase();
    var ip = $('#campo-endereco-ip').val().trim();

    // Validações JavaScript
    if (!nomeCompleto || !nip) {
      alert('Atenção: Por favor, preencha todos os dados pessoais básicos.');
      return;
    }
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

    var dataObj = new Date();
    var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    var dataFormatada = dataObj.getDate() + " de " + meses[dataObj.getMonth()] + " de " + dataObj.getFullYear();

    var { jsPDF } = window.jspdf;
    var doc = new jsPDF('p', 'mm', 'a4');

    var margemTop = 20;
    var margemLeft = 20;
    var larguraTexto = 170;
    var lineHeight = 5;

    // --- CABEÇALHO ---
    doc.setFont("Carlito", "bold");
    doc.setFontSize(12);
    doc.text("MARINHA DO BRASIL", 105, margemTop, { align: "center" });
    doc.text(om, 105, margemTop + 6, { align: "center" });
    
    var titulo = (tipoTermo === 'tre') ? "TERMO DE RESPONSABILIDADE DE ESTAÇÃO DE TRABALHO" : (tipoTermo === 'tri') ? "TERMO DE RESPONSABILIDADE INDIVIDUAL" : "TERMO DE RESPONSABILIDADE PORTAL/MÁQUINA VIRTUAL";
    doc.text(titulo, 105, margemTop + 6, { align: "center" });

    // Início Y do corpo do texto
    var posYAtual = margemTop + 30; 

    // Mágica das Variáveis Padrão (Sem a lista de programas ainda)
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
      .replace(/\[PROGRAMAS_INSTALADOS\]/g, "");
      
    // Limpeza de Enters duplicados
    textoProcessado = textoProcessado.replace(/\n{3,}/g, '\n\n');
    doc.setFont("Carlito", "normal");

    // LÓGICA DE RENDERIZAÇÃO (TRE vs Outros)
    if (tipoTermo === 'tre') {
        // 1. Encontra a posição do "II – de instalação de programas:"
        var marcadorQuebra = "II – de instalação de programas:";
        var partes = textoProcessado.split(marcadorQuebra);
        
        // Se por acaso o administrador apagou a frase padrão, fallback para gerar tudo normal
        if (partes.length !== 2) {
            partes = [textoProcessado, ""];
        } else {
            // Reanexa o título da seção na parte de cima
            partes[0] = partes[0] + marcadorQuebra;
            // Remove espaços em branco do início da parte de baixo
            partes[1] = partes[1].trim(); 
        }

        // 2. Renderiza a Primeira Metade do Texto
        var linhasTexto1 = doc.splitTextToSize(partes[0], larguraTexto);
        doc.text(linhasTexto1, margemLeft, posYAtual);
        posYAtual = posYAtual + (linhasTexto1.length * lineHeight) + 2;

        // 3. Renderiza a Tabela de Programas NO MEIO do texto
        var rows = [];
        $('.checkboxes-programas input:checked').each(function(index) {
            rows.push([index + 1, $(this).val(), 'Instalado']);
        });

        doc.autoTable({
            startY: posYAtual,
            margin: { left: margemLeft, right: margemLeft },
            head: [['Item', 'Nome doPrograma', 'Status']],
            body: rows,
            theme: 'grid',
            styles: { font: "Carlito", fontSize: 9 },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' }
        });
        
        posYAtual = doc.lastAutoTable.finalY + 5;

        // 4. Renderiza a Segunda Metade do Texto (após a tabela)
        if (partes[1].length > 0) {
            var linhasTexto2 = doc.splitTextToSize(partes[1], larguraTexto);
            
            // Verifica se a parte 2 vai estourar a página. Se sim, joga pra folha 2.
            if ((posYAtual + (linhasTexto2.length * lineHeight)) > 270) {
                doc.addPage();
                posYAtual = margemTop;
            }
            
            doc.text(linhasTexto2, margemLeft, posYAtual);
            posYAtual = posYAtual + (linhasTexto2.length * lineHeight) + 15;
        } else {
            posYAtual += 15;
        }

    } else {
        // TRI ou TRPVM: Renderiza o texto inteiro normalmente
        var linhasDoTexto = doc.splitTextToSize(textoProcessado, larguraTexto);
        doc.text(linhasDoTexto, margemLeft, posYAtual);
        posYAtual = posYAtual + (linhasDoTexto.length * lineHeight) + 15;
    }

    // Regra da Quebra de Página para o bloco de Data e Assinatura (Mínimo de 40mm de espaço)
    if (posYAtual > 250) { 
        doc.addPage(); 
        posYAtual = margemTop + 10; 
    }

    // --- BLOCO DE DATA (Acima da assinatura e alinhado à esquerda) ---
    doc.setFont("Carlito", "normal");
    doc.text("Rio de Janeiro, " + dataFormatada + ".", margemLeft, posYAtual);
    
    // Adiciona espaço vertical para desenhar a linha da assinatura
    posYAtual += 15; 

    // --- ASSINATURA ---
    doc.text("___________________________________________________", 105, posYAtual, { align: "center" });
    
    doc.setFont("Carlito", "bold");
    doc.text(nomeCompleto, 105, posYAtual + lineHeight, { align: "center" });
    
    doc.setFont("Carlito", "normal");
    var especialidadeFormatada = quadroEspec === "Sem Esp" ? "" : "(" + quadroEspec + ")";
    doc.text(postoGrad + especialidadeFormatada + " " + nip, 105, posYAtual + (lineHeight * 2), { align: "center" });

    // --- NOME DO ARQUIVO E DOWNLOAD ---
    var nomeArquivo = tipoTermo.toUpperCase() + " " + postoGrad + especialidadeFormatada + " " + nip + " " + nomeCompleto + ".pdf";
    doc.save(nomeArquivo);
  }

})(jQuery, once, Drupal, drupalSettings);