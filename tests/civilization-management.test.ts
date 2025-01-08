import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let civilizationCount = 0;
const civilizations = new Map();

// Simulated contract functions
function createCivilization(name: string, description: string, parameters: number[], creator: string) {
  const civilizationId = ++civilizationCount;
  civilizations.set(civilizationId, {
    creator,
    name,
    description,
    parameters,
    technologyLevel: 1,
    population: 1000000,
    resources: 1000,
    status: 'active'
  });
  return civilizationId;
}

function updateCivilizationStatus(civilizationId: number, newStatus: string, updater: string) {
  const civilization = civilizations.get(civilizationId);
  if (!civilization) throw new Error('Invalid civilization');
  if (updater !== 'CONTRACT_OWNER' && updater !== civilization.creator) throw new Error('Not authorized');
  civilization.status = newStatus;
  civilizations.set(civilizationId, civilization);
  return true;
}

function updateCivilizationParameters(civilizationId: number, newParameters: number[], updater: string) {
  const civilization = civilizations.get(civilizationId);
  if (!civilization) throw new Error('Invalid civilization');
  if (updater !== civilization.creator) throw new Error('Not authorized');
  civilization.parameters = newParameters;
  civilizations.set(civilizationId, civilization);
  return true;
}

describe('Civilization Management Contract', () => {
  beforeEach(() => {
    civilizationCount = 0;
    civilizations.clear();
  });
  
  it('should create a new civilization', () => {
    const civilizationId = createCivilization('Zorgons', 'An advanced spacefaring civilization', [1, 2, 3, 4, 5], 'user1');
    expect(civilizationId).toBe(1);
    expect(civilizations.size).toBe(1);
    const civilization = civilizations.get(civilizationId);
    expect(civilization.name).toBe('Zorgons');
    expect(civilization.status).toBe('active');
  });
  
  it('should update civilization status', () => {
    const civilizationId = createCivilization('Humans', 'Earthlings exploring the cosmos', [2, 4, 6, 8, 10], 'user2');
    expect(updateCivilizationStatus(civilizationId, 'declining', 'CONTRACT_OWNER')).toBe(true);
    const civilization = civilizations.get(civilizationId);
    expect(civilization.status).toBe('declining');
  });
  
  it('should update civilization parameters', () => {
    const civilizationId = createCivilization('Xylorians', 'Tree-like beings with collective consciousness', [3, 6, 9, 12, 15], 'user3');
    expect(updateCivilizationParameters(civilizationId, [4, 8, 12, 16, 20], 'user3')).toBe(true);
    const civilization = civilizations.get(civilizationId);
    expect(civilization.parameters).toEqual([4, 8, 12, 16, 20]);
  });
  
  it('should not allow unauthorized status updates', () => {
    const civilizationId = createCivilization('Aquarians', 'Water-dwelling species with advanced biotechnology', [5, 10, 15, 20, 25], 'user4');
    expect(() => updateCivilizationStatus(civilizationId, 'extinct', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow unauthorized parameter updates', () => {
    const civilizationId = createCivilization('Mechanoids', 'Self-replicating machine civilization', [1, 3, 5, 7, 9], 'user5');
    expect(() => updateCivilizationParameters(civilizationId, [2, 4, 6, 8, 10], 'unauthorized_user')).toThrow('Not authorized');
  });
});

