import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let technologyCount = 0;
const technologies = new Map();

// Simulated contract functions
function discoverTechnology(civilizationId: number, name: string, description: string, creator: string) {
  const technologyId = ++technologyCount;
  technologies.set(technologyId, {
    civilizationId,
    name,
    description,
    level: 1,
    discoveryBlock: Date.now()
  });
  return technologyId;
}

function advanceTechnology(technologyId: number, updater: string) {
  const technology = technologies.get(technologyId);
  if (!technology) throw new Error('Invalid technology');
  if (updater !== 'creator') throw new Error('Not authorized');
  technology.level += 1;
  technologies.set(technologyId, technology);
  return true;
}

describe('Technology Advancement Contract', () => {
  beforeEach(() => {
    technologyCount = 0;
    technologies.clear();
  });
  
  it('should discover a new technology', () => {
    const technologyId = discoverTechnology(1, 'Quantum Computing', 'Harnessing quantum superposition for computation', 'user1');
    expect(technologyId).toBe(1);
    expect(technologies.size).toBe(1);
    const technology = technologies.get(technologyId);
    expect(technology.name).toBe('Quantum Computing');
    expect(technology.level).toBe(1);
  });
  
  it('should advance technology level', () => {
    const technologyId = discoverTechnology(2, 'Fusion Power', 'Clean and abundant energy from nuclear fusion', 'user2');
    expect(advanceTechnology(technologyId, 'creator')).toBe(true);
    const technology = technologies.get(technologyId);
    expect(technology.level).toBe(2);
  });
  
  it('should not allow unauthorized technology advancement', () => {
    const technologyId = discoverTechnology(3, 'Warp Drive', 'Faster-than-light travel technology', 'user3');
    expect(() => advanceTechnology(technologyId, 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should maintain correct technology information', () => {
    const technologyId = discoverTechnology(4, 'Nanotechnology', 'Manipulation of matter at the atomic scale', 'user4');
    const technology = technologies.get(technologyId);
    expect(technology.civilizationId).toBe(4);
    expect(technology.name).toBe('Nanotechnology');
    expect(technology.level).toBe(1);
    expect(technology.discoveryBlock).toBeLessThanOrEqual(Date.now());
  });
});

