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
  userId: string;
  candidateName: string;
  isAnonymous: boolean;
  subjectScore: number;
  ira: number;
  finalScore: number;
  modalityPreference: 'remunerada' | 'voluntaria';
  trend: 'up' | 'down' | 'same';
  submittedAt: string;
}
