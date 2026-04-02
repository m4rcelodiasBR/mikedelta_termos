(function ($, once, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.mikeDeltaTermosGerador = {
    attach: function (context, settings) {
      
      // 1. Alternância de Hierarquia (Oficial, Praça, Civil)
      $(once('categoriaChange', '.categoria-selector input', context)).on('change', function() {
        atualizarSelectsPatente($(this).val());
      });
      if ($('.categoria-selector input:checked', context).length) {
        atualizarSelectsPatente($('.categoria-selector input:checked', context).val());
      }

      // 2. Validação de Regras RM ao trocar Posto
      $(once('postoChange', '.posto-grad-select', context)).on('change', function() {
        validarLimitesRM($(this).val());
      });

      // 3. Função Marcar/Desmarcar Todos
      $(once('marcarTodosClick', '#checkbox-marcar-todos-mestre', context)).on('change', function() {
        var status = $(this).is(':checked');
        $('.checkboxes-programas input[type="checkbox"]').prop('checked', status);
      });

      // 4. Máscaras e Maiúsculas
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

      // 5. Máscara Automática NIP (Militar) ou CPF (Civil)
      $(once('identificacaoMask', '#campo-nip', context)).on('input', function() {
        var cat = $('.categoria-selector input:checked').val();
        var val = $(this).val().replace(/\D/g, ''); 
        
        if (cat === 'civil') {
          // CPF: 000.000.000-00
          val = val.replace(/(\d{3})(\d)/, '$1.$2');
          val = val.replace(/(\d{3})(\d)/, '$1.$2');
          val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
          // NIP: 00.0000.00
          if (val.length > 6) {
            val = val.replace(/^(\d{2})(\d{4})(\d{0,2}).*/, '$1.$2.$3');
          } else if (val.length > 2) {
            val = val.replace(/^(\d{2})(\d{0,4}).*/, '$1.$2');
          }
        }
        $(this).val(val);
      });

      $(once('bindClickGeradorTermos', '#btn-gerar-pdf', context)).on('click', function (e) {
        e.preventDefault();
        gerarDocumentoPDF(settings);
      });

      $(once('toggleMestreTRE', '.tipo-termo-selector input', context)).on('change', function() {
        if ($(this).val() === 'tre') {
          $('#wrapper-marcar-todos').show();
        } else {
          $('#wrapper-marcar-todos').hide();
        }
      });
      $('.tipo-termo-selector input:checked').trigger('change');
    }
  };

  /**
   * Povoa os Selects baseada na escolha e amarra as regras de NIP/CPF e Civis
   */
  function atualizarSelectsPatente(categoria) {
    var $posto = $('.posto-grad-select');
    var $quadro = $('#campo-quadro-espec');
    var $campoIdent = $('#campo-nip');
    var $labelIdent = $('label[for="campo-nip"]');
    var $descIdent = $('.desc-formato-ident');

    $posto.empty();
    $quadro.empty();
    $campoIdent.val('');

    if (categoria === 'civil') {
      $posto.append('<option value="Civil">Servidor Civil</option>');
      $quadro.append('<option value="Sem Esp">-</option>');      
      $labelIdent.text('CPF');
      $descIdent.text('Formato: 000.000.000-00');
      $campoIdent.attr('placeholder', '000.000.000-00').attr('maxlength', '14');
    } else {
      $labelIdent.text('NIP');
      $descIdent.text('Formato: 00.0000.00');
      $campoIdent.attr('placeholder', '00.0000.00').attr('maxlength', '10');
      
      if (categoria === 'oficial') {
        $posto.append('<option value="AE">AE</option><option value="VA">VA</option><option value="CA">CA</option><option value="CMG">CMG</option><option value="CF">CF</option><option value="CC">CC</option><option value="CT">CT</option><option value="1T">1T</option><option value="2T">2T</option><option value="GM">GM</option>');
        $quadro.append('<option value="CA">CA</option><option value="T">T</option><option value="FN">FN</option><option value="IM">IM</option><option value="MD">MD</option><option value="QC-CA">QC-CA</option><option value="AA">AA</option><option value="Sem Esp">-</option>');
      } else {
        $posto.append('<option value="SO">SO</option><option value="1SG">1SG</option><option value="2SG">2SG</option><option value="3SG">3SG</option><option value="CB">CB</option><option value="SD">SD</option><option value="MN">MN</option>');
        $quadro.append('<option value="OR">OR</option><option value="MR">MR</option><option value="EF">EF</option><option value="MO">MO</option><option value="CN">CN</option><option value="PL">PL</option><option value="PD">PD</option><option value="CP">CP</option><option value="Sem Esp">-</option>');
      }
    }
    validarLimitesRM($posto.val());
  }

  /**
   * Ativa/Desativa botões RM1, RM2 e RM3 baseado no Mapa de Classes
   */
  function validarLimitesRM(postoAtual) {
    var cat = $('.categoria-selector input:checked').val();
    var $radioCarreira = $('input[name="tipo_militar"][value="carreira"]');
    var $radioRm1 = $('input[name="tipo_militar"][value="rm1"]');
    var $radioRm2 = $('input[name="tipo_militar"][value="rm2"]');
    var $radioRm3 = $('input[name="tipo_militar"][value="rm3"]');

    // Reseta todos para habilitado por padrão (Corrige o erro de Carreira bloqueada)
    $('input[name="tipo_militar"]').prop('disabled', false).parent().css('opacity', '1');

    if (cat === 'oficial') {
      var rm2Oficiais = ['GM', '2T', '1T', 'CT'];
      var rm3Oficiais = ['CC', 'CF', 'CMG'];
      if (!rm2Oficiais.includes(postoAtual)) $radioRm2.prop('disabled', true).parent().css('opacity', '0.5');
      if (!rm3Oficiais.includes(postoAtual)) $radioRm3.prop('disabled', true).parent().css('opacity', '0.5');
    } else if (cat === 'praca') {
      var rm2Pracas = ['MN', 'CB', '3SG'];
      if (!rm2Pracas.includes(postoAtual)) $radioRm2.prop('disabled', true).parent().css('opacity', '0.5');
      $radioRm3.prop('disabled', true).parent().css('opacity', '0.5');
    }

    if ($('input[name="tipo_militar"]:checked').prop('disabled')) {
      $radioCarreira.prop('checked', true);
    }
  }

  /**
   * Função principal de processamento do PDF
   */
  function gerarDocumentoPDF(settings) {
    var categoria = $('.categoria-selector input:checked').val();
    var tipoMilitar = $('input[name="tipo_militar"]:checked').val();
    var nomeCompleto = $('#campo-nome-completo').val().trim().toUpperCase();
    var identValue = $('#campo-nip').val().trim();
    var postoGrad = $('.posto-grad-select').val();
    var quadroEspec = $('#campo-quadro-espec').val();
    var tipoTermo = $('.tipo-termo-selector input:checked').val();
    
    var omPadrao = settings.mikedelta_termos.om_padrao || 'CPO';
    var omDigitada = $('#campo-om').val().trim();
    var om = omDigitada ? omDigitada.toUpperCase() : omPadrao.toUpperCase();

    var macAddress = $('#campo-mac-address').val().trim();
    var nomeMaquina = $('#campo-nome-maquina').val().trim().toUpperCase();
    var ip = $('#campo-endereco-ip').val().trim();

    if (!nomeCompleto || !identValue) {
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

    // Processamento da Especialidade para Militares (RM ou Carreira)
    var especialidadeFormatada = "";
    if (categoria !== 'civil') {
        if (tipoMilitar !== 'carreira') {
            var siglaRM = tipoMilitar.toUpperCase();
            if (quadroEspec === "Sem Esp") {
                especialidadeFormatada = "(" + siglaRM + ")";
            } else {
                especialidadeFormatada = "(" + siglaRM + "-" + quadroEspec + ")";
            }
        } else {
            especialidadeFormatada = quadroEspec === "Sem Esp" ? "" : "(" + quadroEspec + ")";
        }
    }

    // Lógica para o corpo do texto (Esconde patentes se for Civil)
    var textoPosto = (categoria === 'civil') ? "" : postoGrad;
    var textoEspec = (categoria === 'civil') ? "" : especialidadeFormatada.replace(/[()]/g, '');

    if (categoria === 'civil') {
        textoBase = textoBase.replace(/\bNIP\b/g, 'CPF'); // Troca a palavra NIP no corpo do texto
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
    
    var tituloY = margemTop + 8; 
    if (om !== "") {
        doc.text(om, 105, margemTop + 6, { align: "center" });
        tituloY = margemTop + 16; 
    }
    
    var titulo = (tipoTermo === 'tre') ? "TERMO DE RECEBIMENTO DE ESTAÇÃO DE TRABALHO" : (tipoTermo === 'tri') ? "TERMO DE RESPONSABILIDADE INDIVIDUAL" : "TERMO DE RESPONSABILIDADE PORTAL/MÁQUINA VIRTUAL";
    doc.text(titulo, 105, tituloY, { align: "center" });

    var posYAtual = tituloY + 12; 

    // Substituição das variáveis no texto
    var textoProcessado = textoBase
      .replace(/\[POSTO_GRAD\]/g, textoPosto)
      .replace(/\[QUADRO_ESPEC\]/g, textoEspec)
      .replace(/\[NOME_COMPLETO\]/g, nomeCompleto)
      .replace(/\[NIP\]/g, identValue)
      .replace(/\[CPF\]/g, identValue)
      .replace(/\[OM\]/g, om)
      .replace(/\[DATA_ATUAL\]/g, dataFormatada)
      .replace(/\[MAC_ADDRESS\]/g, macAddress)
      .replace(/\[IDENTIFICACAO_MAQUINA\]/g, nomeMaquina)
      .replace(/\[IP\]/g, ip)
      .replace(/\[PROGRAMAS_INSTALADOS\]/g, "");
      
    // Limpeza de espaços mantendo os parágrafos intactos (CORREÇÃO APLICADA)
    textoProcessado = textoProcessado.replace(/\n{3,}/g, '\n\n').trim(); // Limpa Enters vazios em excesso
    textoProcessado = textoProcessado.replace(/ {2,}/g, ' '); // Substitui múltiplos espaços por apenas um (ignora Enters)
    
    doc.setFont("Carlito", "normal");

    function imprimirTextoComPaginacao(linhasDeTexto) {
        for (var i = 0; i < linhasDeTexto.length; i++) {
            if (posYAtual > 275) { 
                doc.addPage();
                posYAtual = margemTop;
            }
            doc.text(linhasDeTexto[i], margemLeft, posYAtual);
            posYAtual += lineHeight;
        }
    }

    // --- LÓGICA DE RENDERIZAÇÃO ---
    if (tipoTermo === 'tre') {
        var marcadorQuebra = "II – de instalação de programas:";
        var partes = textoProcessado.split(marcadorQuebra);
        
        if (partes.length !== 2) {
            partes = [textoProcessado, ""];
        } else {
            partes[0] = partes[0] + marcadorQuebra;
        }

        var linhasTexto1 = doc.splitTextToSize(partes[0].trim(), larguraTexto);
        imprimirTextoComPaginacao(linhasTexto1);
        
        var rows = [];
        $('.checkboxes-programas input:checked').each(function(index) {
            if($(this).attr('id') !== 'checkbox-marcar-todos-mestre') {
                rows.push([index, $(this).val(), 'Instalado']); 
            }
        });

        for (var i = 0; i < rows.length; i++) { rows[i][0] = i + 1; }

        doc.autoTable({
            startY: posYAtual,
            margin: { left: margemLeft, right: margemLeft },
            head: [['Item', 'Nome do Programa', 'Status']],
            body: rows,
            theme: 'grid',
            styles: { font: "Carlito", fontSize: 9, cellPadding: 1.5 },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' }
        });
        
        posYAtual = doc.lastAutoTable.finalY + 10; 

        if (partes[1].trim().length > 0) {
            var linhasTexto2 = doc.splitTextToSize(partes[1].trim(), larguraTexto);
            imprimirTextoComPaginacao(linhasTexto2);
        }

    } else {
        var linhasDoTexto = doc.splitTextToSize(textoProcessado, larguraTexto);
        imprimirTextoComPaginacao(linhasDoTexto);
    }

    // --- BLOCO DA ASSINATURA ---
    posYAtual += 4; 

    if (posYAtual > 255) { 
        doc.addPage(); 
        posYAtual = margemTop + 10; 
    }

    doc.setFont("Carlito", "normal");
    doc.text("Rio de Janeiro, " + dataFormatada + ".", margemLeft, posYAtual);
    
    posYAtual += 12; 

    doc.text("___________________________________________________", 105, posYAtual, { align: "center" });
    
    doc.setFont("Carlito", "bold");
    doc.text(nomeCompleto, 105, posYAtual + lineHeight, { align: "center" });
    
    doc.setFont("Carlito", "normal");
    
    var nomeArquivo = "";
    
    // Assinatura e Arquivo: Lógica de Civil vs Militar
    if (categoria === 'civil') {
        doc.text("CPF: " + identValue, 105, posYAtual + (lineHeight * 2), { align: "center" });
        nomeArquivo = tipoTermo.toUpperCase() + " CPF " + identValue + " " + nomeCompleto + ".pdf";
    } else {
        doc.text(postoGrad + " " + especialidadeFormatada + " " + identValue, 105, posYAtual + (lineHeight * 2), { align: "center" });
        nomeArquivo = tipoTermo.toUpperCase() + " " + postoGrad + " " + especialidadeFormatada + " " + identValue + " " + nomeCompleto + ".pdf";
    }

    // Limpa os espaços duplos no nome do arquivo caso a especialidade seja vazia
    nomeArquivo = nomeArquivo.replace(/ {2,}/g, ' ');

    doc.save(nomeArquivo);

    setTimeout(function() {
      alert("Documento gerado com sucesso! O formulário será reiniciado.");
      window.location.reload(); 
    }, 1000);
  }

})(jQuery, once, Drupal, drupalSettings);