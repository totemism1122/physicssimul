// P-04 Conservation of momentum (2D). Menus follow docs/plan_v0.4.md section 3.7.
// Mass (adding weights), initial velocity (pulling back) and the kind of collision (changing bumpers)
// are set by hand in the scene, so they are not in the menu.
export default {
  view: '2d',
  fixedViews: ['front', 'top'],
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'collide', options: [
        { id: 'collide', label: '충돌' }, { id: 'split', label: '분리' }, { id: 'plane', label: '평면 충돌', advanced: true },
      ] },
      { id: 'friction', label: '마찰', kind: 'toggle' },
      { id: 'bounce', label: '튕기는 정도', kind: 'slider', min: 0, max: 1, step: 0.05, value: 1, digits: 2, advanced: true },
    ],
    graph: [
      { id: 'momentum', label: '운동량 막대', kind: 'graph', x: '', y: '운동량' },
      { id: 'velocity', label: '속도–시간', kind: 'graph', x: '시간', y: '속도' },
      { id: 'forceTime', label: '힘–시간', kind: 'graph', x: '시간', y: '힘', advanced: true },
      { id: 'kinetic', label: '운동 에너지 막대', kind: 'graph', x: '', y: '운동 에너지', advanced: true },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'toImpact', label: '충돌 순간으로', kind: 'action', advanced: true },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'momentumArrow', label: '운동량 화살표', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'pairForce', label: '주고받는 힘', kind: 'toggle', advanced: true },
      { id: 'centre', label: '질량 중심', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'note', text: '실행할 때마다 표에 한 줄씩 기록됩니다.' },
      { id: 'cases', label: '예제 상황', kind: 'note', text: '밀기와 분리 상황을 다시 만들어 봅니다.' },
      { id: 'energy', label: '운동 에너지 비교', kind: 'note', text: '충돌 전후의 운동 에너지를 비교합니다.', advanced: true },
    ],
  },
};
