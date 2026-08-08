import crypto from 'crypto';

/**
 * 🔒 ARQUITETURA DE CONTROLE DUAL & CRIPTOGRAFIA AES-256
 * 
 * Este arquivo demonstra como a criptografia será feita no servidor
 * ANTES de enviar qualquer dado sensível para o banco de dados (Supabase).
 */

// 1. O SERVIDOR PUXA AS DUAS CHAVES DAS VARIÁVEIS DE AMBIENTE DA VERCEL
// Nenhuma dessas chaves fica salva no código ou no banco.
const CHAVE_A_CRIADOR = process.env.CHAVE_MESTRA_CRIADOR || '';
const CHAVE_B_TI = process.env.CHAVE_MESTRA_TI || '';

/**
 * Mistura as duas chaves usando XOR (OU Exclusivo).
 * Se faltar a chave da TI ou a chave do criador, é matematicamente
 * impossível gerar a Chave Final correta.
 */
function gerarChaveFinalXOR(chaveA: string, chaveB: string): Buffer {
  const bufferA = Buffer.from(chaveA, 'hex');
  const bufferB = Buffer.from(chaveB, 'hex');
  
  const finalBuffer = Buffer.alloc(32); // 256 bits para o AES-256
  
  for (let i = 0; i < 32; i++) {
    // A mágica matemática do Controle Dual acontece aqui:
    finalBuffer[i] = bufferA[i] ^ bufferB[i]; 
  }
  
  return finalBuffer;
}

/**
 * Criptografa os dados do aluno (Nome, IRA, Email)
 * Retorna um texto totalmente embaralhado que será salvo no banco de dados.
 */
export function criptografarDadosDoAluno(textoReal: string): string {
  // 1. Gera a chave final combinada na memória
  const chaveFinal = gerarChaveFinalXOR(CHAVE_A_CRIADOR, CHAVE_B_TI);
  
  // 2. Cria um Vetor de Inicialização aleatório (adiciona mais caos)
  const iv = crypto.randomBytes(16);
  
  // 3. Tranca o cofre (AES-256-GCM)
  const cipher = crypto.createCipheriv('aes-256-gcm', chaveFinal, iv);
  let textoEmbaralhado = cipher.update(textoReal, 'utf8', 'hex');
  textoEmbaralhado += cipher.final('hex');
  
  const tagAutenticacao = cipher.getAuthTag();

  // Retorna apenas a "caixa trancada"
  return `${iv.toString('hex')}:${tagAutenticacao.toString('hex')}:${textoEmbaralhado}`;
}

/**
 * Descriptografa os dados.
 * Esta função será chamada APENAS pelo Cron Job das 5 horas da manhã
 * para poder fazer o ranking. Depois do ranking, a memória é limpa.
 */
export function descriptografarParaRanking(caixaTrancada: string): string {
  const chaveFinal = gerarChaveFinalXOR(CHAVE_A_CRIADOR, CHAVE_B_TI);
  
  const partes = caixaTrancada.split(':');
  const iv = Buffer.from(partes[0], 'hex');
  const tagAutenticacao = Buffer.from(partes[1], 'hex');
  const textoEmbaralhado = partes[2];
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', chaveFinal, iv);
  decipher.setAuthTag(tagAutenticacao);
  
  let textoReal = decipher.update(textoEmbaralhado, 'hex', 'utf8');
  textoReal += decipher.final('utf8');
  
  return textoReal;
}
