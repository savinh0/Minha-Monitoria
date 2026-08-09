import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 flex flex-col items-center">
      
      {/* Botão Superior */}
      <div className="w-full max-w-4xl px-4 mb-6 flex justify-start">
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
        >
          <ArrowLeft size={18} /> Voltar para o Login
        </Link>
      </div>

      <div 
        className="bg-white shadow-2xl p-10 sm:p-16 w-full max-w-4xl rounded-sm border-t-8 border-sisuBlue relative overflow-hidden"
        style={{ fontFamily: '"Times New Roman", Times, serif', color: '#1f2937' }}
      >
        {/* Marca d'água decorativa */}
        <div className="absolute top-8 right-8 opacity-5">
          <Scale size={120} />
        </div>

        <h1 className="text-center font-bold text-xl mb-12 uppercase border-b-2 border-gray-200 pb-6 text-gray-900 tracking-wider">
          Termos e Condições Gerais de Uso do Sistema "Minha Monitoria"
        </h1>

        <section className="mb-10">
          <h2 className="font-bold text-lg mb-5 uppercase text-sisuBlue">
            1. Da Natureza do Serviço e Isenção de Responsabilidade Oficial
          </h2>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            1.1. O "Minha Monitoria" (doravante denominado "Sistema") é uma plataforma de caráter estritamente comunitário, não-oficial e independente, desenvolvida com o fito de simular e estimar classificações para vagas de monitoria acadêmica.
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            1.2. O Sistema <strong>NÃO</strong> possui qualquer vínculo institucional, patrocínio, endosso ou homologação por parte da universidade ou de suas instâncias administrativas (coordenações, pró-reitorias, etc.).
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            1.3. O cálculo das notas de corte, as posições estimadas e os ranqueamentos apresentados são meramente ilustrativos e de caráter especulativo. O Usuário reconhece e concorda que a classificação final, real e oficial dependerá exclusivamente dos trâmites estipulados no edital oficial da instituição de ensino, isentando os criadores do Sistema de qualquer responsabilidade por divergências nos resultados.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-lg mb-5 uppercase text-sisuBlue">
            2. Do Tratamento e Proteção de Dados (Lei Geral de Proteção de Dados - LGPD)
          </h2>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            2.1. Para a prestação do serviço, o Sistema coleta e armazena informações estritamente necessárias ao seu funcionamento, tais como: e-mail institucional, Índice de Rendimento Acadêmico (IRA), notas em disciplinas específicas e preferências de vaga (remunerada/voluntária).
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            2.2. Os dados fornecidos são armazenados em infraestrutura segura e não serão, em hipótese alguma, comercializados, cedidos, alugados ou transferidos a terceiros para fins publicitários ou comerciais.
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            2.3. O Sistema reserva-se o direito de manter as submissões registradas em banco de dados para garantir a integridade do ranqueamento (evitando múltiplas inscrições simultâneas), bem como para compor o histórico dinâmico de notas de corte.
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            2.4. O Usuário possui a prerrogativa de utilizar o "Modo Anônimo", que ocultará o seu nome e e-mail no ranqueamento público visualizado por outros usuários, garantindo sua privacidade sem comprometer a transparência da nota de corte coletiva.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-lg mb-5 uppercase text-sisuBlue">
            3. Da Integridade do Sistema e Condutas Vedadas
          </h2>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            3.1. É terminantemente proibido ao Usuário, sob pena de exclusão imediata e banimento do Sistema, sem prejuízo das sanções cíveis e penais cabíveis:
          </p>
          <ul className="list-none pl-10 mb-4 space-y-3">
            <li className="text-justify leading-loose text-base">a) Realizar tentativas de engenharia reversa, invasão, ou testes de vulnerabilidade não autorizados nos servidores ou no código-fonte do Sistema;</li>
            <li className="text-justify leading-loose text-base">b) Interceptar, manipular ou forjar requisições de rede (APIs) para inserir dados falsos, alterar o Índice de Rendimento Acadêmico (IRA) ou modificar notas de maneira fraudulenta;</li>
            <li className="text-justify leading-loose text-base">c) Utilizar robôs, <em>spiders</em>, <em>crawlers</em> ou qualquer mecanismo automatizado para extrair dados em massa (<em>scraping</em>) do Sistema.</li>
          </ul>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            3.2. O Sistema possui mecanismos de defesa em nível de banco de dados e aplicação para mitigar ações fraudulentas, reservando-se aos administradores o direito de cancelar e deletar submissões que apresentem indícios de manipulação.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-lg mb-5 uppercase text-sisuBlue">
            4. Da Aceitação dos Termos
          </h2>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            4.1. Ao marcar a caixa de seleção "Eu aceito os Termos do Usuário" e autenticar-se no Sistema via e-mail institucional, o Usuário declara ter lido, compreendido e concordado expressa e integralmente com todos os itens descritos neste documento.
          </p>
          <p className="text-justify indent-10 mb-4 leading-loose text-base">
            4.2. Estes Termos de Uso poderão ser atualizados ou modificados a qualquer momento, sem aviso prévio, cabendo ao Usuário revisá-los periodicamente. O uso contínuo do Sistema após eventuais modificações constituirá a aceitação tácita das novas condições.
          </p>
        </section>
        
        {/* Assinatura decorativa no final */}
        <div className="mt-16 pt-8 border-t border-gray-300 flex justify-end">
          <div className="text-center w-64">
            <div className="border-b border-gray-800 mb-2"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-700">A Administração</p>
            <p className="text-xs text-gray-500 italic mt-1">Minha Monitoria</p>
          </div>
        </div>
      </div>

      {/* Botão Inferior */}
      <div className="w-full max-w-4xl px-4 mt-8 flex justify-center">
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm"
        >
          <ArrowLeft size={18} /> Voltar para o Login
        </Link>
      </div>

    </div>
  );
}
