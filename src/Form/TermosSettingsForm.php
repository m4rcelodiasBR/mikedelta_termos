<?php

namespace Drupal\mikedelta_termos\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Classe para gerenciar as configurações do módulo Mike Delta Termos.
 */
class TermosSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'mikedelta_termos.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mikedelta_termos_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('mikedelta_termos.settings');

    $form['programas_tre'] = [
        '#type' => 'textarea',
        '#title' => $this->t('Programas disponíveis para o TRE'),
        '#description' => $this->t('Insira um programa por linha. Eles aparecerão como checkboxes para o usuário.'),
        '#default_value' => $config->get('programas_tre') ?? "Microsoft Office\nLibreOffice\nAdobe Reader\nZimbra\nNavegador Web",
        '#rows' => 5,
    ];  

    $form['informacoes'] = [
      '#markup' => '<div class="messages messages--status"><p>Utilize as variáveis abaixo para que os dados do formulário sejam inseridos no PDF:</p>
      <ul>
        <li><strong>[POSTO_GRAD]</strong>, <strong>[QUADRO_ESPEC]</strong>, <strong>[NOME_COMPLETO]</strong>, <strong>[NIP]</strong>, <strong>[OM]</strong>, <strong>[DATA_ATUAL]</strong></li>
        <li><em>Específicos do TRE:</em> <strong>[IP]</strong>, <strong>[MAC_ADDRESS]</strong>, <strong>[IDENTIFICACAO_MAQUINA]</strong>, <strong>[PROGRAMAS_INSTALADOS]</strong></li>
      </ul></div>',
    ];

    $textoTrePadrao = "Pelo presente instrumento, eu, [POSTO_GRAD] [QUADRO_ESPEC] [NIP] [NOME_COMPLETO], perante a Marinha do Brasil, doravante denominada MB, na qualidade de usuário do ambiente computacional de propriedade daquela Instituição, declaro ter recebido desta OM uma estação de trabalho com as seguintes configurações:\n\nI – de identificação:\n(a) endereço IP: [IP];\n(b) endereço físico de rede: [MAC_ADDRESS]; e\n(c) identificação da máquina: [IDENTIFICACAO_MAQUINA].\n\nII – de instalação de programas:\n[PROGRAMAS_INSTALADOS]\n\nIII – de senha de acesso à máquina (“boot”):\nInicialmente estabelecida pelo Administrador da Rede Local (ADMIN) da OM e por mim alterada, sendo agora de meu conhecimento exclusivo;\n\nIV – de senha de configuração (“setup”):\nDe conhecimento exclusivo do ADMIN e à qual não devo tomar conhecimento.\n\nV – Configurações de hardware:\nAs configurações de hardware posteriormente serão anexadas a este termo e qualquer necessidade de alteração por parte do usuário deve ser prontamente informada ao ADMIN e realizadas somente sob sua supervisão.\nAssim, quaisquer alterações ou inclusões nos dados acima são de minha inteira responsabilidade e devem ser previamente autorizadas pelo Oficial de Segurança da Informação e Comunicações (OSIC), conforme previsto nas normas de Segurança das Informações Digitais da OM.\n\nEstou ciente que o ADMIN executou a “formatação” prévia dos discos rígidos da referida estação de trabalho e sua correspondente reconfiguração e que, a qualquer momento e sempre que julgar necessário, poderei solicitar ao ADMIN auxílio para a realização dessa “formatação”, de modo a garantir a configuração padronizada da OM e a inexistência de arquivos ou programas irregulares.";

    $form['texto_tre'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Texto do Termo de Recebimento de Estação de Trabalho (TRE)'),
      '#default_value' => $config->get('texto_tre') ?? $textoTrePadrao,
      '#rows' => 15,
    ];

    $textoTriPadrao = "Pelo presente instrumento, eu, [POSTO_GRAD] [NOME_COMPLETO], NIP [NIP], perante a Marinha do Brasil, doravante denominada MB, na qualidade de usuário do ambiente computacional de propriedade daquela Instituição, declaro estar ciente das normas de segurança das informações digitais da OM, segundo as quais devo:\n\na) tratar a informação digital como patrimônio da MB e como um recurso que deva ter seu sigilo preservado, em consonância com a legislação vigente;\n\nb) utilizar as informações disponíveis e os sistemas e produtos computacionais, dos quais a MB é proprietária ou possui o direito de uso, exclusivamente para o interesse do serviço;\n\nc) preservar o conteúdo das informações sigilosas a que tiver acesso, sem divulgá-las para pessoas não autorizadas;\n\nd) não tentar obter acesso a informação cujo grau de sigilo não seja compatível com a minha Credencial de Segurança (CREDSEG) ou que eu não tenha autorização ou necessidade de conhecer;\n\ne) não compartilhar o uso de senha com outros usuários;\n\nf) não me fazer passar por outro usuário usando a sua identificação de acesso e senha;\n\ng) não alterar o endereço de rede ou qualquer outro dado de identificação do microcomputador de meu uso;\n\nh) instalar e utilizar em meu microcomputador somente programas homologados para uso na MB e que esta possua as respectivas licenças de uso ou, no caso de programas de domínio público, mediante autorização formal do Oficial de Segurança da Informação e Comunicações (OSIC) da OM;\n\ni) no caso de exoneração, demissão, licenciamento, término de prestação de serviço ou qualquer tipo de afastamento, preservar o conteúdo das informações e documentos sigilosos a que tive acesso e não divulgá-los para pessoas não autorizadas;\n\nj) guardar segredo das minhas autenticações de acesso (senhas) utilizadas no ambiente computacional da OM, não cedendo, não transferindo, não divulgando e não permitindo o seu conhecimento por terceiros;\n\nk) não utilizar senha com sequência fácil ou óbvia de caracteres que facilite a sua descoberta e não escrever a senha em lugares visíveis ou de fácil acesso;\n\nl) utilizar, ao me afastar momentaneamente da minha estação de trabalho, descanso de tela (“screen saver”) protegido por senha, a fim de evitar que alguém possa ver as informações que estejam disponíveis na tela do computador;\n\nm) ao me ausentar do local de trabalho, momentaneamente ou ao término de minhas atividades diárias, certificar-me de que a sessão aberta no ambiente computacional com minha identificação foi fechada e as informações que exigem sigilo foram adequadamente salvaguardadas;\n\nn) seguir as orientações da área de informática da OM relativas à instalação, à manutenção e ao uso adequado dos equipamentos, dos sistemas e dos programas do ambiente computacional;\n\no) comunicar imediatamente ao meu superior hierárquico e ao Oficial de Segurança da Informação e Comunicações (OSIC) da OM a ocorrência de qualquer evento que implique ameaça ou impedimento de cumprir os procedimentos de segurança estabelecidos;\n\np) responder, perante a MB, às auditorias e ao Oficial de Segurança da Informação e Comunicações (OSIC) da OM, por acessos, tentativas de acessos ou uso indevido da informação digital realizados com a minha identificação ou autenticação;\n\nq) não praticar quaisquer atos que possam afetar o sigilo ou a integridade da informação;\n\nr) estar ciente de que toda informação digital armazenada e processada no ambiente computacional da OM pode ser auditada, como no caso de páginas informativas (“sites”) visitadas por mim;\n\ns) não transmitir, copiar ou reter arquivos contendo textos, fotos, filmes ou quaisquer outros registros que contrariem a moral, os bons costumes e a legislação vigente;\n\nt) não transferir qualquer tipo de arquivo que pertença à MB para outro local, seja por meio magnético ou não, exceto no interesse do serviço e mediante autorização da autoridade competente;\n\nu) estar ciente de que o processamento, o trâmite e o armazenamento de arquivos que não sejam de interesse do serviço são expressamente proibidos no ambiente computacional da OM;\n\nv) estar ciente de que a MB poderá auditar os arquivos em trâmite ou armazenados nos equipamentos do ambiente computacional da OM sob meu uso ou responsabilidade;\n\nw) estar ciente de que o correio eletrônico é de uso exclusivo para o interesse do serviço e qualquer correspondência eletrônica originada ou retransmitida no ambiente computacional da OM deve obedecer a este preceito; e\n\nx) estar ciente de que a MB poderá auditar as correspondências eletrônicas originadas ou retransmitidas por mim no ambiente computacional da OM.\n\nDesta forma, estou ciente da minha responsabilidade pelas consequências decorrentes da não observância do acima exposto e da legislação vigente.";

    $form['texto_tri'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Texto do Termo de Responsabilidade Individual (TRI)'),
      '#default_value' => $config->get('texto_tri') ?? $textoTriPadrao,
      '#rows' => 15,
    ];

    $textoTrpvmPadrao = "O Portal MB, Máquina Virtual MB e as informações por estes sistemas disponibilizadas são de propriedade da Marinha do Brasil. Na qualidade de usuário do ambiente computacional de propriedade da MB, declaro estar ciente das normas e procedimentos para a segurança da informação em vigor (DGMM-0540 Rev3) e da Lei nº 13.709/2018 – Lei Geral de Proteção de Dados (LGPD), devendo tratar as informações disponíveis, sistemas e produtos computacionais, dos quais a MB é proprietária ou possui o direito de uso, como um recurso que deva ter seu sigilo preservado, bem como, utilizá-lo exclusivamente para o serviço, em consonância com a legislação vigente.";

    $form['texto_trpvm'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Texto do Termo de Responsabilidade de Portal/Máquina Virtual (TRPVM)'),
      '#default_value' => $config->get('texto_trpvm') ?? $textoTrpvmPadrao,
      '#rows' => 10,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('mikedelta_termos.settings')
        ->set('programas_tre', $form_state->getValue('programas_tre'))
        ->set('texto_tre', $form_state->getValue('texto_tre'))
        ->set('texto_tri', $form_state->getValue('texto_tri'))
        ->set('texto_trpvm', $form_state->getValue('texto_trpvm'))
        ->save();

    parent::submitForm($form, $form_state);
  }

}