import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Fretboard Flash i18n translations', () => {
  const requiredKeys = [
    'learn.fretboardFlash.title',
    'learn.fretboardFlash.description',
    'fretboardFlash.startButton',
    'fretboardFlash.stopButton',
    'fretboardFlash.fretboardAlt',
  ];

  function readXlf(filename: string): string {
    return readFileSync(resolve(process.cwd(), 'src/locale', filename), 'utf-8');
  }

  function extractTransUnitIds(xlf: string): string[] {
    const regex = /trans-unit\s+id="([^"]+)"/g;
    const ids: string[] = [];
    let match;
    while ((match = regex.exec(xlf)) !== null) {
      ids.push(match[1]);
    }
    return ids;
  }

  function extractTargets(xlf: string): Map<string, string> {
    const map = new Map<string, string>();
    const regex = /<trans-unit\s+id="([^"]+)"[^>]*>[\s\S]*?<target>([\s\S]*?)<\/target>/g;
    let match;
    while ((match = regex.exec(xlf)) !== null) {
      map.set(match[1], match[2].trim());
    }
    return map;
  }

  describe('source file (messages.xlf)', () => {
    let sourceIds: string[];

    beforeAll(() => {
      const xlf = readXlf('messages.xlf');
      sourceIds = extractTransUnitIds(xlf);
    });

    it.each(requiredKeys)('should contain trans-unit for %s', (key) => {
      expect(sourceIds).toContain(key);
    });
  });

  describe('Dutch translations (messages.nl.xlf)', () => {
    let nlTargets: Map<string, string>;

    beforeAll(() => {
      const xlf = readXlf('messages.nl.xlf');
      nlTargets = extractTargets(xlf);
    });

    it.each(requiredKeys)('should contain a non-empty Dutch translation for %s', (key) => {
      expect(nlTargets.has(key)).toBe(true);
      expect(nlTargets.get(key)!.length).toBeGreaterThan(0);
    });
  });

  describe('German translations (messages.de.xlf)', () => {
    let deTargets: Map<string, string>;

    beforeAll(() => {
      const xlf = readXlf('messages.de.xlf');
      deTargets = extractTargets(xlf);
    });

    it.each(requiredKeys)('should contain a non-empty German translation for %s', (key) => {
      expect(deTargets.has(key)).toBe(true);
      expect(deTargets.get(key)!.length).toBeGreaterThan(0);
    });
  });
});
