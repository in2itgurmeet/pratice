import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import html2pdf from 'html2pdf.js';

// Strict Data Contract Interfaces
export interface PropertyItem {
  label: string;
  value: string;
}

export interface CellData {
  text: string;
  type: 'added' | 'removed' | 'modified' | 'previous' | 'unchanged' | '';
}
export interface DiffRowStructure {
  columnsData: CellData[];
}
@Component({
  selector: 'app-viewer',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer {

  // Input Parameters for Generic Scaling
  @Input() docTitle: string = 'Configuration Differences Document';
  @Input() columnHeaders: string[] = []; // Example: ['Intended Config', 'Running Config']
  @Input() rawConfigs: string[] = [];    // Array of raw configuration strings sequentially mapped to headers
  @Input() deviceProperties: PropertyItem[][] = []; // Array of arrays for multiple metadata sections

  diffRows: DiffRowStructure[] = [];
  currentTimestamp: string = '';

  constructor(private datePipe: DatePipe) {
    this.currentTimestamp = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss a') || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawConfigs'] || changes['columnHeaders']) {
      this.processGenericMatrixDiff();
    }
  }

  /**
   * Core Logic: Maps multi-version file lines side-by-side into a matching uniform array matrix.
   */
  private processGenericMatrixDiff() {
    this.diffRows = [];
    if (!this.rawConfigs || this.rawConfigs.length === 0) return;

    // Sabhi raw string blocks ko line-by-line arrays me cleanly array map split karein
    const parsedFilesLines = this.rawConfigs.map(configStr => this.cleanTextLines(configStr));

    // Find absolute maximum line height matrix boundary
    const maxLinesCount = Math.max(...parsedFilesLines.map(linesArray => linesArray.length));

    for (let i = 0; i < maxLinesCount; i++) {
      const rowItem: DiffRowStructure = { columnsData: [] };

      parsedFilesLines.forEach((fileLines, fileIdx) => {

        const currentLineText =
          fileLines[i] !== undefined ? fileLines[i] : '';

        let lineClassification:
          'added' | 'removed' | 'modified' | 'previous' | 'unchanged' | '' = '';

        if (currentLineText) {

          if (fileIdx === 0) {
            lineClassification =
              currentLineText !== parsedFilesLines[1]?.[i]
                ? 'removed'
                : 'unchanged';
          }

          else if (fileIdx === 1) {
            lineClassification =
              currentLineText !== parsedFilesLines[0]?.[i]
                ? 'added'
                : 'unchanged';
          }

          // 3rd Column (Previous Config)
          else if (fileIdx === 2) {
            lineClassification = 'previous';
          }

          else {
            lineClassification = 'unchanged';
          }
        }

        rowItem.columnsData.push({
          text: currentLineText,
          type: lineClassification
        });
      });

      this.diffRows.push(rowItem);
    }
  }

  private cleanTextLines(rawStr: string): string[] {
    if (!rawStr) return [];
    const normalized = rawStr.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized.split('\n');
  }


  public async exportToPdf(outputFileName: string = 'Configuration_Report'): Promise<void> {
    const elementToPrint = document.getElementById('diff-pdf-container');
    if (!elementToPrint) return;

    const renderOptions: any = {
      margin: 10, // Margins for clean visual distribution per sheet
      filename: `${outputFileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Retains high pixel depth on low screen resolution screens
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape' // Best aspect ratio configuration layout preservation
      }
    };

    try {
      await html2pdf().set(renderOptions).from(elementToPrint).save();
    } catch (error) {
      console.error('PDF Generation pipeline failure:', error);
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}

