<?php

/**
 * MikeDelta Termos - Módulo para geração de Termos Gerais (TRE, TRI, TRPVM) em PDF.
 * Copyright (C) 2026 Todos os direitos reservados.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Drupal\mikedelta_termos\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

class GeradorTermosForm extends FormBase {

  public function getFormId() {
    return 'mikedelta_termos_gerador_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('mikedelta_termos.settings');

    $is_logged_in = \Drupal::currentUser()->isAuthenticated();
    $url_config = '';
    if ($is_logged_in) {
      $url_config = Url::fromRoute('mikedelta_termos.settings')->toString();
    }

    $form['admin_actions_block'] = [
      '#theme' => 'mikedelta_termos_admin_block',
      '#dados_termos' => [
        'is_logged_in' => $is_logged_in,
        'url_config' => $url_config,
      ],
      '#weight' => -100,
    ];

    $form['titulo_pagina'] = [
      '#markup' => '<h1 class="page-title mb-4">' . $this->t('Gerador de Termos') . '</h1>',
    ];

    $lista_programas = explode("\n", $config->get('programas_tre') ?? "");
    $opcoes_programas = [];
    foreach ($lista_programas as $prog) {
        $prog = trim($prog);
        if (!empty($prog)) {
            $opcoes_programas[$prog] = $prog;
        }
    }

    $form['container_gerador'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['mikedelta-termos-wrapper']],
    ];

    $form['container_gerador']['tipo_termo'] = [
      '#type' => 'radios',
      '#title' => $this->t('Selecione o Termo'),
      '#options' => [
        'tre' => $this->t('Termo de Recebimento de Estação de Trabalho (TRE)'),
        'tri' => $this->t('Termo de Responsabilidade Individual (TRI)'),
        'trpvm' => $this->t('Termo de Responsabilidade Portal/Máquina Virtual (TRPVM)'),
      ],
      '#default_value' => 'tre',
      '#attributes' => ['class' => ['tipo-termo-selector']],
    ];

    $form['container_gerador']['categoria'] = [
      '#type' => 'radios',
      '#title' => $this->t('Hierarquia'),
      '#options' => [
        'oficial' => $this->t('Oficial'),
        'praca' => $this->t('Praça'),
        'civil' => $this->t('Servidor Civil'),
      ],
      '#default_value' => 'oficial',
      '#attributes' => ['class' => ['categoria-selector']],
    ];

    $form['container_gerador']['dados_pessoais'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Dados do Usuário'),
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
      '#id' => 'campo-nip',
      '#attributes' => [
        'placeholder' => '00.0000.00',
        'maxlength' => 10,
      ],
      '#description' => '<span class="desc-formato-ident">Formato: 00.0000.00</span>',
    ];

    $form['container_gerador']['dados_pessoais']['posto_grad'] = [
      '#type' => 'select',
      '#title' => $this->t('Posto/Graduação'),
      '#options' => [
        'AE' => 'AE', 
        'VA' => 'VA', 
        'CA' => 'CA', 
        'CMG' => 'CMG', 
        'CF' => 'CF', 
        'CC' => 'CC', 
        'CT' => 'CT', 
        '1T' => '1T', 
        '2T' => '2T', 
        'GM' => 'GM',
        'SO' => 'SO', 
        '1SG' => '1SG', 
        '2SG' => '2SG', 
        '3SG' => '3SG', 
        'CB' => 'CB', 
        'MN' => 'MN', 
        'SD' => 'SD',
      ],
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-posto-grad', 'class' => ['posto-grad-select']],
    ];

    $form['container_gerador']['dados_pessoais']['quadro_espec'] = [
      '#type' => 'select',
      '#title' => $this->t('Quadro/Especialidade'),
      '#options' => [
        'CA' => 'CA', 
        'T' => 'T', 
        'FN' => 'FN', 
        'IM' => 'IM', 
        'MD' => 'MD', 
        'QC-CA' => 'QC-CA', 
        'AA' => 'AA',
      ],
      '#required' => TRUE,
      '#attributes' => ['id' => 'campo-quadro-espec'],
    ];

    $form['container_gerador']['dados_pessoais']['tipo_militar'] = [
      '#type' => 'radios',
      '#title' => $this->t('Situação do Militar'),
      '#options' => [
        'carreira' => $this->t('da Ativa'),
        'rm1' => $this->t('RM1'),
        'rm2' => $this->t('RM2'),
        'rm3' => $this->t('RM3'),
      ],
      '#default_value' => 'carreira',
      '#attributes' => ['class' => ['container-inline']],
      '#states' => [
        'invisible' => [
          ':input[name="categoria"]' => ['value' => 'civil'],
        ],
      ],
    ];

    $form['container_gerador']['dados_pessoais']['om'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Organização Militar (OM) - Opcional'),
      '#required' => FALSE,
      '#attributes' => [
        'id' => 'campo-om',
        'placeholder' => $config->get('om_padrao') ?? '',
      ],
      '#description' => $this->t('Digite o nome completo de sua OM. Caso deixe em branco, será utilizado o valor padrão definido nas configurações internas.'),
    ];

    $form['container_gerador']['dados_maquina'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Dados da Estação de Trabalho do usuário'),
      '#states' => [
        'visible' => [
          ':input[name="tipo_termo"]' => ['value' => 'tre'],
        ],
      ],
    ];

    $form['container_gerador']['dados_maquina']['mac_address'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Endereço Físico (MAC Address)'),
      '#attributes' => [
        'id' => 'campo-mac-address', 
        'placeholder' => '00-00-00-00-00-00',
        'maxlength' => 17,
      ],
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
      '#title' => $this->t('Endereço IP (IPv4)'),
      '#attributes' => [
        'id' => 'campo-endereco-ip', 
        'placeholder' => '0.0.0.0',
        'pattern' => '^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$',
      ],
      '#description' => $this->t('Digite apenas números IPv4 e os pontos (.). Ex: 10.0.2.15'),
      '#states' => [
        'required' => [':input[name="tipo_termo"]' => ['value' => 'tre']],
      ],
    ];

    $form['container_gerador']['dados_maquina']['marcar_todos_programas'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('<strong>Marcar/Desmarcar todos os Programas instalados</strong>'),
      '#id' => 'checkbox-marcar-todos-mestre',
      '#wrapper_attributes' => [
        'id' => 'wrapper-marcar-todos',
        'style' => 'display: none;',
      ],
    ];

    $form['container_gerador']['dados_maquina']['programas'] = [
        '#type' => 'checkboxes',
        '#title' => $this->t('Selecione os Programas instalados'),
        '#options' => $opcoes_programas,
        '#attributes' => ['class' => ['checkboxes-programas']],
    ];

    $form['container_gerador']['actions'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['d-flex', 'gap-2', 'mt-4', 'mb-4']],
    ];

    $form['container_gerador']['actions']['preview'] = [
      '#type' => 'html_tag',
      '#tag' => 'button',
      '#value' => $this->t('Ler Termo (Pré-visualização)'),
      '#attributes' => [
        'type' => 'button',
        'id' => 'btn-preview-termo',
        'class' => ['button', 'btn', 'btn-primary', 'w-100', 'mt-3'],
        'data-bs-toggle' => 'modal',
        'data-bs-target' => '#modalPreviewTermo',
        'data-toggle' => 'modal',
        'data-target' => '#modalPreviewTermo',
      ],
    ];

    $form['container_gerador']['actions']['gerar'] = [
      '#type' => 'html_tag',
      '#tag' => 'button',
      '#value' => $this->t('Gerar Termo (PDF)'),
      '#attributes' => [
        'type' => 'button',
        'id' => 'btn-gerar-pdf',
        'class' => ['button', 'btn', 'btn-success', 'w-100', 'mt-3'],
      ],
    ];

    $form['modal_preview'] = [
      '#type' => 'inline_template',
      '#template' => '
        <div class="modal fade" id="modalPreviewTermo" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title mb-0"><strong>Pré-visualização do Documento</strong></h5>
                <button type="button" class="btn-close close" data-bs-dismiss="modal" data-dismiss="modal" aria-label="Close">
                </button>
              </div>
              
              <div class="modal-body bg-light text-dark p-4" id="corpo-texto-preview" style="white-space: pre-wrap; font-family: monospace; font-size: 14px; line-height: 1.6;">
                Carregando texto...
              </div>
              
              <div class="modal-footer">
                <button type="button" id="btn-fechar-modal" class="button btn btn-danger mt-3" data-bs-dismiss="modal" data-dismiss="modal">Fechar Visualização</button>
              </div>
            </div>
          </div>
        </div>
      ',
    ];

    $form['#attached']['library'][] = 'mikedelta_termos/gerador_pdf';
    $form['#attached']['drupalSettings']['mikedelta_termos'] = [
        'om_padrao' => $config->get('om_padrao') ?? '',
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