export interface Discipline {
  id: string;
  name: string;
  course: string;
  vagasRemuneradas: number;
  vagasVoluntarias: number;
  status: 'abertas' | 'encerradas';
  createdAt: string;
}

export interface CandidateSubmission {
  id: string;
  disciplineId: string;
  candidateName: string;
  isAnonymous: boolean;
  subjectScore: number; // Nota na matéria (0 a 10)
  ira: number;          // IRA (0 a 10)
  finalScore: number;   // subjectScore + ira
  modalityPreference: 'remunerada' | 'voluntaria' | 'ambas';
  trend: 'up' | 'down' | 'same';
  submittedAt: string;
}

// Chave para armazenar no localStorage
const DISCIPLINES_KEY = 'minha_monitoria_disciplines_v1';
const SUBMISSIONS_KEY = 'minha_monitoria_submissions_v1';

// Dados Iniciais Padrão (Mock)
export const INITIAL_DISCIPLINES: Discipline[] = [
  {
    id: 'disc-1',
    name: 'Anatomia Humana I',
    course: 'Medicina',
    vagasRemuneradas: 2,
    vagasVoluntarias: 3,
    status: 'abertas',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc-2',
    name: 'Fisiologia Médica',
    course: 'Medicina',
    vagasRemuneradas: 1,
    vagasVoluntarias: 2,
    status: 'abertas',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc-3',
    name: 'Patologia Geral',
    course: 'Biomedicina',
    vagasRemuneradas: 2,
    vagasVoluntarias: 1,
    status: 'abertas',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SUBMISSIONS: CandidateSubmission[] = [
  {
    id: 'sub-1',
    disciplineId: 'disc-1',
    candidateName: 'Lucas Ferreira',
    isAnonymous: false,
    subjectScore: 9.8,
    ira: 9.5,
    finalScore: 19.3,
    modalityPreference: 'ambas',
    trend: 'up',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    disciplineId: 'disc-1',
    candidateName: 'Candidato Anônimo',
    isAnonymous: true,
    subjectScore: 9.5,
    ira: 9.1,
    finalScore: 18.6,
    modalityPreference: 'remunerada',
    trend: 'same',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    disciplineId: 'disc-1',
    candidateName: 'Maria Oliveira',
    isAnonymous: false,
    subjectScore: 9.2,
    ira: 9.2,
    finalScore: 18.4,
    modalityPreference: 'ambas',
    trend: 'up',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-4',
    disciplineId: 'disc-1',
    candidateName: 'Candidato Anônimo',
    isAnonymous: true,
    subjectScore: 8.9,
    ira: 9.0,
    finalScore: 17.9,
    modalityPreference: 'ambas',
    trend: 'down',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-5',
    disciplineId: 'disc-1',
    candidateName: 'Sávio (Você)',
    isAnonymous: false,
    subjectScore: 8.7,
    ira: 9.0,
    finalScore: 17.7,
    modalityPreference: 'ambas',
    trend: 'up',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-6',
    disciplineId: 'disc-1',
    candidateName: 'Candidato Anônimo',
    isAnonymous: true,
    subjectScore: 8.5,
    ira: 8.8,
    finalScore: 17.3,
    modalityPreference: 'voluntaria',
    trend: 'same',
    submittedAt: new Date().toISOString(),
  },
  // Submissões para Fisiologia
  {
    id: 'sub-7',
    disciplineId: 'disc-2',
    candidateName: 'Ana Clara Santos',
    isAnonymous: false,
    subjectScore: 9.9,
    ira: 9.7,
    finalScore: 19.6,
    modalityPreference: 'remunerada',
    trend: 'same',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-8',
    disciplineId: 'disc-2',
    candidateName: 'Sávio (Você)',
    isAnonymous: false,
    subjectScore: 9.4,
    ira: 9.0,
    finalScore: 18.4,
    modalityPreference: 'ambas',
    trend: 'up',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'sub-9',
    disciplineId: 'disc-2',
    candidateName: 'Candidato Anônimo',
    isAnonymous: true,
    subjectScore: 9.0,
    ira: 8.9,
    finalScore: 17.9,
    modalityPreference: 'voluntaria',
    trend: 'down',
    submittedAt: new Date().toISOString(),
  },
];

// Helper para ler Disciplinas
export function getStoredDisciplines(): Discipline[] {
  if (typeof window === 'undefined') return INITIAL_DISCIPLINES;
  const stored = localStorage.getItem(DISCIPLINES_KEY);
  if (!stored) {
    localStorage.setItem(DISCIPLINES_KEY, JSON.stringify(INITIAL_DISCIPLINES));
    return INITIAL_DISCIPLINES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DISCIPLINES;
  }
}

// Helper para salvar Disciplinas
export function saveStoredDisciplines(disciplines: Discipline[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DISCIPLINES_KEY, JSON.stringify(disciplines));
}

// Helper para ler Submissões
export function getStoredSubmissions(): CandidateSubmission[] {
  if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  if (!stored) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

// Helper para salvar Submissões
export function saveStoredSubmissions(submissions: CandidateSubmission[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}
