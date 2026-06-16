import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monaco-editor',
  imports: [MonacoEditorModule, CommonModule, FormsModule],
  templateUrl: './monaco-editor.html',
  styleUrl: './monaco-editor.scss',
})
export class MonacoEditor {
  @ViewChild('editorContainer') editorContainer: any;

  editorOptions: any;
  code: string = `// Welcome to Monaco Editor\n// You can write your code here\nconsole.log('Hello, World!');

function add(a: number, b: number): number {
  return a + b;
}

const result = add(5, 3);
console.log('Result:', result);`;

  currentTheme: string = 'vs-dark';
  currentLanguage: string = 'javascript';
  fontSize: number = 14;
  wordWrap: string = 'on';
  showLineNumbers: boolean = true;
  showMinimap: boolean = true;
  autoSave: boolean = false;

  themes = [
    { name: 'Dark', value: 'vs-dark' },
    { name: 'Light', value: 'vs' },
    { name: 'High Contrast', value: 'hc-black' },
    { name: 'Quiet Light', value: 'quiet-light' },
  ];

  languages = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C#', value: 'csharp' },
    { name: 'PHP', value: 'php' },
    { name: 'SQL', value: 'sql' },
    { name: 'XML', value: 'xml' },
    { name: 'YAML', value: 'yaml' },
  ];

  copyMessage: string = '';
  uploadProgress: number = 0;
  isUploading: boolean = false;

  constructor() {
    this.initializeEditorOptions();
  }

  initializeEditorOptions(): void {
    this.editorOptions = {
      theme: this.currentTheme,
      language: this.currentLanguage,
      fontSize: this.fontSize,
      wordWrap: this.wordWrap,
      lineNumbers: this.showLineNumbers ? 'on' : 'off',
      minimap: { enabled: this.showMinimap },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'blink',
      formatOnPaste: true,
      formatOnType: true,
      bracketPairColorization: { enabled: true },
      "bracketPairColorization.independentColorPoolPerBracketType": true,
    };
  }

  onThemeChange(theme: string): void {
    this.currentTheme = theme;
    this.editorOptions = { ...this.editorOptions, theme };
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
    this.editorOptions = { ...this.editorOptions, language };
  }

  onFontSizeChange(size: number): void {
    this.fontSize = size;
    this.editorOptions = { ...this.editorOptions, fontSize: size };
  }

  onWordWrapChange(value: string): void {
    this.wordWrap = value;
    this.editorOptions = { ...this.editorOptions, wordWrap: value };
  }

  onLineNumbersChange(show: boolean): void {
    this.showLineNumbers = show;
    this.editorOptions = {
      ...this.editorOptions,
      lineNumbers: show ? 'on' : 'off',
    };
  }

  onMinimapChange(show: boolean): void {
    this.showMinimap = show;
    this.editorOptions = {
      ...this.editorOptions,
      minimap: { enabled: show },
    };
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code).then(
      () => {
        this.copyMessage = 'Code copied to clipboard!';
        setTimeout(() => {
          this.copyMessage = '';
        }, 2000);
      },
      () => {
        this.copyMessage = 'Failed to copy!';
        setTimeout(() => {
          this.copyMessage = '';
        }, 2000);
      }
    );
  }

  downloadCode(): void {
    const fileExtension = this.getFileExtension(this.currentLanguage);
    const fileName = `code.${fileExtension}`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.code));
    element.setAttribute('download', fileName);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  uploadCode(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.ts,.html,.css,.json,.py,.java,.cs,.php,.sql,.xml,.yml,.yaml';

    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.isUploading = true;
        this.uploadProgress = 0;

        const reader = new FileReader();
        const progressInterval = setInterval(() => {
          this.uploadProgress += Math.random() * 30;
          if (this.uploadProgress > 90) {
            this.uploadProgress = 90;
          }
        }, 100);

        reader.onload = (e: any) => {
          clearInterval(progressInterval);
          this.uploadProgress = 100;
          this.code = e.target.result;

          // Detect language from file extension
          const fileName = file.name.toLowerCase();
          this.detectLanguage(fileName);

          setTimeout(() => {
            this.isUploading = false;
            this.uploadProgress = 0;
          }, 500);
        };

        reader.onerror = () => {
          clearInterval(progressInterval);
          this.isUploading = false;
          this.uploadProgress = 0;
          alert('Failed to read file');
        };

        reader.readAsText(file);
      }
    });

    input.click();
  }

  detectLanguage(fileName: string): void {
    const extensionMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.html': 'html',
      '.htm': 'html',
      '.css': 'css',
      '.json': 'json',
      '.py': 'python',
      '.java': 'java',
      '.cs': 'csharp',
      '.php': 'php',
      '.sql': 'sql',
      '.xml': 'xml',
      '.yml': 'yaml',
      '.yaml': 'yaml',
    };

    for (const [ext, lang] of Object.entries(extensionMap)) {
      if (fileName.endsWith(ext)) {
        this.onLanguageChange(lang);
        break;
      }
    }
  }

  getFileExtension(language: string): string {
    const extensionMap: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      php: 'php',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yml',
    };

    return extensionMap[language] || 'txt';
  }

  clearCode(): void {
    if (confirm('Are you sure you want to clear the editor?')) {
      this.code = '';
    }
  }

  resetSettings(): void {
    this.currentTheme = 'vs-dark';
    this.currentLanguage = 'javascript';
    this.fontSize = 14;
    this.wordWrap = 'on';
    this.showLineNumbers = true;
    this.showMinimap = true;
    this.initializeEditorOptions();
  }
}
