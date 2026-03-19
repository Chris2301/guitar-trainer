import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Fretboard SVG asset', () => {
  const svgPath = resolve(__dirname, '../../../../public/images/fretboard.svg');
  let svgContent: string;

  beforeAll(() => {
    svgContent = existsSync(svgPath) ? readFileSync(svgPath, 'utf-8') : '';
  });

  it('should exist as a file in the public assets directory', () => {
    expect(existsSync(svgPath)).toBe(true);
  });

  it('should be a valid SVG document', () => {
    expect(svgContent).toContain('<svg');
    expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svgContent).toContain('</svg>');
  });

  it('should contain 6 strings represented as horizontal lines', () => {
    const stringLines = svgContent.match(/<line[^>]*class="string"[^>]*\/?>/g);
    expect(stringLines).not.toBeNull();
    expect(stringLines!.length).toBe(6);
  });

  it('should contain the nut and 15 fret lines', () => {
    const fretLines = svgContent.match(/<line[^>]*class="fret"[^>]*\/?>/g);
    const nutLine = svgContent.match(/<line[^>]*class="nut"[^>]*\/?>/g);
    expect(nutLine).not.toBeNull();
    expect(nutLine!.length).toBe(1);
    expect(fretLines).not.toBeNull();
    expect(fretLines!.length).toBe(15);
  });

  it('should contain single fret markers at positions 3, 5, 7, 9, 15', () => {
    const singleMarkers = svgContent.match(/<circle[^>]*class="fret-marker"[^>]*\/?>/g);
    expect(singleMarkers).not.toBeNull();
    expect(singleMarkers!.length).toBe(5);
  });

  it('should contain a double fret marker at position 12', () => {
    const doubleMarkers = svgContent.match(/<circle[^>]*class="fret-marker-double"[^>]*\/?>/g);
    expect(doubleMarkers).not.toBeNull();
    expect(doubleMarkers!.length).toBe(2);
  });

  it('should use a viewBox for scalable rendering', () => {
    const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
    expect(viewBoxMatch).not.toBeNull();
  });
});
