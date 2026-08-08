import { NextResponse } from 'next/server';
import { INITIAL_SUBMISSIONS, CandidateSubmission } from '@/lib/store';
import { criptografarDadosDoAluno } from '@/lib/encryption';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_SUBMISSIONS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { disciplineId, candidateName, isAnonymous, subjectScore, ira, modalityPreference } = body;

    if (!disciplineId || subjectScore === undefined || ira === undefined) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    const nSubject = Number(subjectScore);
    const nIra = Number(ira);
    const finalScore = nSubject + nIra;

    const rawCandidateName = isAnonymous ? 'Candidato Anônimo' : (candidateName || 'Candidato Anônimo');

    // Exemplo de uso da segurança Dual Control:
    // Criptografa o nome e nota sensíveis caso estejamos enviando para o banco
    const encryptedPayload = criptografarDadosDoAluno(
      JSON.stringify({ name: rawCandidateName, subjectScore: nSubject, ira: nIra })
    );

    const newSubmission: CandidateSubmission = {
      id: `sub-${Date.now()}`,
      disciplineId,
      candidateName: rawCandidateName,
      isAnonymous: Boolean(isAnonymous),
      subjectScore: nSubject,
      ira: nIra,
      finalScore,
      modalityPreference: modalityPreference || 'ambas',
      trend: 'same',
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Simulação submetida com sucesso.',
      data: newSubmission,
      securityHash: encryptedPayload, // Hash AES-256 demonstrativo
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar submissão.' },
      { status: 500 }
    );
  }
}
