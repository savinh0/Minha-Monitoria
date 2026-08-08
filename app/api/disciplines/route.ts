import { NextResponse } from 'next/server';
import { INITIAL_DISCIPLINES, Discipline } from '@/lib/store';

// Em ambiente de produção, este handler conecta ao Supabase / PostgreSQL.
// Para a versão demonstrativa, retorna o estado estático/mock.

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_DISCIPLINES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, course, vagasRemuneradas, vagasVoluntarias, status } = body;

    if (!name || !course) {
      return NextResponse.json(
        { success: false, error: 'Nome e Curso são obrigatórios.' },
        { status: 400 }
      );
    }

    const newDiscipline: Discipline = {
      id: `disc-${Date.now()}`,
      name,
      course,
      vagasRemuneradas: Number(vagasRemuneradas) || 0,
      vagasVoluntarias: Number(vagasVoluntarias) || 0,
      status: status || 'abertas',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Disciplina criada com sucesso.',
      data: newDiscipline,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
