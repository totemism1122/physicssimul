// The three subjects and their 52 sections, in textbook order (docs/plan_v0.4.md, section 3).
// ready: true once the simulation for that section exists.
const s = (code, name, ready = false) => ({ code, name, ready });

export const SUBJECTS = [
  {
    id: 'physics', name: '물리학',
    parts: [
      { roman: 'I', name: '힘과 에너지', chapters: [
        { name: '힘과 운동', sims: [s('P-01', '평형과 안정성', true), s('P-02', '힘과 가속도', true), s('P-03', '작용 반작용', true), s('P-04', '운동량 보존', true)] },
        { name: '에너지와 열', sims: [s('P-05', '역학적 에너지 보존', true), s('P-06', '에너지 보존', true), s('P-07', '열에너지의 전환', true)] },
      ] },
      { roman: 'II', name: '전기와 자기', chapters: [
        { name: '전기', sims: [s('P-08', '전기장과 전위차', true), s('P-09', '소비 전력', true), s('P-10', '축전기의 활용', true)] },
        { name: '자기', sims: [s('P-11', '자성체'), s('P-12', '전류의 자기 작용'), s('P-13', '전자기 유도', true)] },
      ] },
      { roman: 'III', name: '빛과 물질', chapters: [
        { name: '빛의 성질과 이중성', sims: [s('P-14', '빛의 중첩과 간섭'), s('P-15', '빛의 굴절과 렌즈'), s('P-16', '빛과 물질의 이중성')] },
        { name: '반도체·상대성 이론', sims: [s('P-17', '에너지 준위'), s('P-18', '에너지띠와 반도체'), s('P-19', '시간 팽창과 길이 수축')] },
      ] },
    ],
  },
  {
    id: 'mechanics', name: '역학과 에너지',
    parts: [
      { roman: 'I', name: '시공간과 운동', chapters: [
        { name: '힘과 운동', sims: [s('M-01', '힘의 합성'), s('M-02', '포물선 운동과 역학적 에너지 보존'), s('M-03', '등속 원운동과 진자 운동')] },
        { name: '중력의 작용과 등가 원리', sims: [s('M-04', '케플러 법칙과 중력'), s('M-05', '탈출 속도'), s('M-06', '일반 상대론')] },
      ] },
      { roman: 'II', name: '열과 에너지', chapters: [
        { name: '열과 일', sims: [s('M-07', '열전달과 우리 생활'), s('M-08', '물질의 상태 변화와 이상 기체'), s('M-09', '열역학 제1법칙')] },
        { name: '열기관과 엔트로피', sims: [s('M-10', '열기관과 우리 생활'), s('M-11', '열역학 제2법칙')] },
      ] },
      { roman: 'III', name: '탄성파와 소리', chapters: [
        { name: '탄성파의 성질', sims: [s('M-12', '단진동'), s('M-13', '탄성파의 성질과 활용')] },
        { name: '도플러 효과와 파동의 이용', sims: [s('M-14', '도플러 효과'), s('M-15', '음파의 간섭과 소음 제어'), s('M-16', '정상파')] },
      ] },
    ],
  },
  {
    id: 'quantum', name: '전자기와 양자',
    parts: [
      { roman: 'I', name: '전자기적 상호작용', chapters: [
        { name: '전기장과 자기장', sims: [s('Q-01', '전기력선과 등전위면'), s('Q-02', '정전기 유도와 유전 분극'), s('Q-03', '전류에 의한 자기장'), s('Q-04', '로런츠 힘')] },
        { name: '전자기 활용', sims: [s('Q-05', '전자기 유도'), s('Q-06', '저항, 축전기, 인덕터의 활용'), s('Q-07', '반도체 소자')] },
      ] },
      { roman: 'II', name: '빛과 정보통신', chapters: [
        { name: '광학 기술', sims: [s('Q-08', '빛의 간섭과 회절'), s('Q-09', '렌즈와 거울을 이용한 광학 기기'), s('Q-10', '편광')] },
        { name: '정보 통신', sims: [s('Q-11', '광전 효과와 관련 기술'), s('Q-12', '레이저의 원리와 활용')] },
      ] },
      { roman: 'III', name: '양자와 미시세계', chapters: [
        { name: '양자 기술', sims: [s('Q-13', '이중성과 확률 파동'), s('Q-14', '확률 파동과 중첩')] },
        { name: '양자 역학·핵융합', sims: [s('Q-15', '터널 효과'), s('Q-16', '불확정성 원리'), s('Q-17', '핵융합')] },
      ] },
    ],
  },
];

export const findSubject = (id) => SUBJECTS.find((subject) => subject.id === id);

// Looks a simulation up by its code and says where it sits: { subject, part, chapter, sim, number }.
export function findSim(code) {
  for (const subject of SUBJECTS) for (const part of subject.parts) for (const chapter of part.chapters) {
    const i = chapter.sims.findIndex((sim) => sim.code === code);
    if (i >= 0) return { subject, part, chapter, sim: chapter.sims[i], number: String(i + 1).padStart(2, '0') };
  }
  return null;
}
