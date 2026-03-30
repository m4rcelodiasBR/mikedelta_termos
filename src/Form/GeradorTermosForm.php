<?php

namespace Drupal\mikedelta_termos\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class GeradorTermosForm extends FormBase {

  public function getFormId() {
    return 'mikedelta_termos_gerador_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('mikedelta_termos.settings');

    $lista_programas = explode("\n", $config->get('programas_tre') ?? "");
    $opcoes_programas = [];
    foreach ($lista_programas as $prog) {
        $prog = trim($prog);
        if (!empty($prog)) {
            $opcoes_programas[$prog] = $prog;
        }
}

    // Container principal para dar o estilo de "Card" (o tema cuida do visual)
    $form['container_gerador'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['mikedelta-termos-wrapper']],
    ];

    // 1. Tipo de Termo (Controlará o que aparece abaixo)
    $form['container_gerador']['tipo_termo'] = [
      '#type' => 'radios',
      '#title' => $this->t('Selecione o Termo:'),
      '#options' => [
        'tre' => $this->t('Termo de Responsabilidade de Estação de Trabalho (TRE)'),
        'tri' => $this->t('Termo de Responsabilidade Individual (TRI)'),
        'trpvm' => $this->t('Termo de Responsabilidade Portal/Máquina Virtual (TRPVM)'),
      ],
      '#default_value' => 'tre',
      '#attributes' => ['class' => ['tipo-termo-selector']],
    ];

    // 2. Seletor Categoria (Oficial ou Praça) - Usado para filtrar as opções de Posto/Graduação
    $form['container_gerador']['categoria'] = [
      '#type' => 'radios',
      '#title' => $this->t('Categoria:'),
      '#options' => [
        'oficial' => $this->t('Oficial'),
        'praca' => $this->t('Praça'),
      ],
      '#default_value' => 'oficial',
      '#attributes' => ['class' => ['categoria-selector']],
    ];

    // --- DADOS PESSOAIS (Comuns a todos os termos) ---
    $form['container_gerador']['dados_pessoais'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Dados do Militar'),
    ];

    $form['container_gerador']['dados_pessoais']['nome_completo'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Nome Completo'),
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-nome-completo', 'placeholder' => 'NOME COMPLETO DO MILITAR'],
    ];

    $form['container_gerador']['dados_pessoais']['nip'] = [
      '#type' => 'textfield',
      '#title' => $this->t('NIP'),
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-nip', 'placeholder' => 'XX.XXXX.XX'],
    ];

    // Select de Posto/Graduação (As options serão filtradas via JS baseado na 'categoria')
    $form['container_gerador']['dados_pessoais']['posto_grad'] = [
      '#type' => 'select',
      '#title' => $this->t('Posto/Graduação'),
      '#options' => [
        'AE' => 'AE', 'VA' => 'VA', 'CA' => 'CA', 'CMG' => 'CMG', 'CF' => 'CF', 'CC' => 'CC', 'CT' => 'CT', '1T' => '1T', '2T' => '2T',
        'SO' => 'SO', '1SG' => '1SG', '2SG' => '2SG', '3SG' => '3SG', 'CB' => 'CB', 'MN' => 'MN', 'RM2' => 'RM2',
      ],
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-posto-grad', 'class' => ['posto-grad-select']],
    ];

    $form['container_gerador']['dados_pessoais']['quadro_espec'] = [
      '#type' => 'select',
      '#title' => $this->t('Quadro/Especialidade'),
      '#options' => [
        'CA' => 'CA', 'T' => 'T', 'RM2-T' => 'RM2-T', 'FN' => 'FN', 'IM' => 'IM', 'MD' => 'MD', 'QC-CA' => 'QC-CA', 'AA' => 'AA',
      ],
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-quadro-espec'],
    ];

    // A OM agora é um campo comum, já que os textos base usam [OM]
    $form['container_gerador']['dados_pessoais']['om'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Organização Militar (OM)'),
      '#default_value' => 'CPO', // Valor padrão baseado na sua imagem
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-om'],
    ];


    // --- DADOS ESPECÍFICOS DO TRE ---
    // Este fieldset só aparecerá se o 'tipo_termo' selecionado for 'tre'
    $form['container_gerador']['dados_maquina'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Dados da Máquina (TRE)'),
      '#states' => [
        'visible' => [
          ':input[name="tipo_termo"]' => ['value' => 'tre'],
        ],
      ],
    ];

    $form['container_gerador']['dados_maquina']['mac_address'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Endereço Físico (MAC Address)'),
      '#attributes' => ['id' => 'campo-mac-address', 'placeholder' => '00-00-00-00-00-00'],
      // Torna obrigatório apenas se estiver visível (recurso States)
      '#states' => [
        'required' => [':input[name="tipo_termo"]' => ['value' => 'tre']],
      ],
    ];

    $form['container_gerador']['dados_maquina']['nome_maquina'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Identificação da Máquina'),
      '#attributes' => ['id' => 'campo-nome-maquina', 'placeholder' => 'CPO-C-XX'],
      '#states' => [
        'required' => [':input[name="tipo_termo"]' => ['value' => 'tre']],
      ],
    ];

    $form['container_gerador']['dados_maquina']['endereco_ip'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Endereço IP'),
      '#attributes' => ['id' => 'campo-endereco-ip', 'placeholder' => '0.0.0.0'],
      '#states' => [
        'required' => [':input[name="tipo_termo"]' => ['value' => 'tre']],
      ],
    ];

    // Programas Instalados (Checkboxes)
    $form['container_gerador']['dados_maquina']['programas'] = [
        '#type' => 'checkboxes',
        '#title' => $this->t('Selecione os Programas Instalados:'),
        '#options' => $opcoes_programas,
        '#attributes' => ['class' => ['checkboxes-programas']],
    ];


    // 3. Botão de Ação
    $form['container_gerador']['actions']['gerar'] = [
      '#type' => 'html_tag',
      '#tag' => 'button',
      '#value' => $this->t('Gerar PDF'),
      '#attributes' => [
        'type' => 'button',
        'id' => 'btn-gerar-pdf',
        'class' => ['button', 'button--primary', 'btn', 'btn-success', 'w-100', 'mt-3'], // Adicionadas classes Bootstrap
      ],
    ];

    // 4. Anexando JS e Textos do Banco
    $form['#attached']['library'][] = 'mikedelta_termos/gerador_pdf';
    $form['#attached']['drupalSettings']['mikedelta_termos'] = [
      'textos' => [
        'tre' => $config->get('texto_tre'),
        'tri' => $config->get('texto_tri'),
        'trpvm' => $config->get('texto_trpvm'),
      ]
    ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {}

}