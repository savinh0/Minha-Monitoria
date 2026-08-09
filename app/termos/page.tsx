import React from 'react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-200 py-10 flex justify-center">
      <div 
        className="bg-white shadow-2xl p-12 sm:p-20 w-full max-w-4xl"
        style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000' }}
      >
        <h1 className="text-center font-bold text-lg mb-8 uppercase">
          Termos e Condições Gerais de Uso do Sistema "Minha Monitoria"
        </h1>

        <section className="mb-8">
          <h2 className="font-bold text-base mb-4 uppercase">
            1. Da Natureza do Serviço e Isenção de Responsabilidade Oficial
          </h2>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            1.1. O "Minha Monitoria" (doravante denominado "Sistema") é uma plataforma de caráter estritamente comunitário, não-oficial e independente, desenvolvida com o fito de simular e estimar classificações para vagas de monitoria acadêmica.
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            1.2. O Sistema <strong>NÃO</strong> possui qualquer vínculo institucional, patrocínio, endosso ou homologação por parte da universidade ou de suas instâncias administrativas (coordenações, pró-reitorias, etc.).
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            1.3. O cálculo das notas de corte, as posições estimadas e os ranqueamentos apresentados são meramente ilustrativos e de caráter especulativo. O Usuário reconhece e concorda que a classificação final, real e oficial dependerá exclusivamente dos trâmites estipulados no edital oficial da instituição de ensino, isentando os criadores do Sistema de qualquer responsabilidade por divergências nos resultados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-bold text-base mb-4 uppercase">
            2. Do Tratamento e Proteção de Dados (Lei Geral de Proteção de Dados - LGPD)
          </h2>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            2.1. Para a prestação do serviço, o Sistema coleta e armazena informações estritamente necessárias ao seu funcionamento, tais como: e-mail institucional, Índice de Rendimento Acadêmico (IRA), notas em disciplinas específicas e preferências de vaga (remunerada/voluntária).
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            2.2. Os dados fornecidos são armazenados em infraestrutura segura e não serão, em hipótese alguma, comercializados, cedidos, alugados ou transferidos a terceiros para fins publicitários ou comerciais.
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            2.3. O Sistema reserva-se o direito de manter as submissões registradas em banco de dados para garantir a integridade do ranqueamento (evitando múltiplas inscrições simultâneas), bem como para compor o histórico dinâmico de notas de corte.
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            2.4. O Usuário possui a prerrogativa de utilizar o "Modo Anônimo", que ocultará o seu nome e e-mail no ranqueamento público visualizado por outros usuários, garantindo sua privacidade sem comprometer a transparência da nota de corte coletiva.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-bold text-base mb-4 uppercase">
            3. Da Integridade do Sistema e Condutas Vedadas
          </h2>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            3.1. É terminantemente proibido ao Usuário, sob pena de exclusão imediata e banimento do Sistema, sem prejuízo das sanções cíveis e penais cabíveis:
          </p>
          <ul className="list-none pl-8 mb-3 space-y-2">
            <li className="text-justify leading-relaxed">a) Realizar tentativas de engenharia reversa, invasão, ou testes de vulnerabilidade não autorizados nos servidores ou no código-fonte do Sistema;</li>
            <li className="text-justify leading-relaxed">b) Interceptar, manipular ou forjar requisições de rede (APIs) para inserir dados falsos, alterar o Índice de Rendimento Acadêmico (IRA) ou modificar notas de maneira fraudulenta;</li>
            <li className="text-justify leading-relaxed">c) Utilizar robôs, <em>spiders</em>, <em>crawlers</em> ou qualquer mecanismo automatizado para extrair dados em massa (<em>scraping</em>) do Sistema.</li>
          </ul>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            3.2. O Sistema possui mecanismos de defesa em nível de banco de dados e aplicação para mitigar ações fraudulentas, reservando-se aos administradores o direito de cancelar e deletar submissões que apresentem indícios de manipulação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-bold text-base mb-4 uppercase">
            4. Da Aceitação dos Termos
          </h2>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            4.1. Ao marcar a caixa de seleção "Eu aceito os Termos do Usuário" e autenticar-se no Sistema via e-mail institucional, o Usuário declara ter lido, compreendido e concordado expressa e integralmente com todos os itens descritos neste documento.
          </p>
          <p className="text-justify indent-8 mb-3 leading-relaxed">
            4.2. Estes Termos de Uso poderão ser atualizados ou modificados a qualquer momento, sem aviso prévio, cabendo ao Usuário revisá-los periodicamente. O uso contínuo do Sistema após eventuais modificações constituirá a aceitação tácita das novas condições.
          </p>
        </section>
      </div>
    </div>
  );
}
