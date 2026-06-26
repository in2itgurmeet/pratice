import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { MultiSelectComponent, MultiSelectConfig } from 'cats-ui-lib';
import { Viewer } from '../viewer/viewer';

declare const monaco: any;

@Component({
  selector: 'app-monaco-diff',
  imports: [MonacoEditorModule, FeatherModule, FormsModule, MultiSelectComponent, CommonModule,Viewer],
  templateUrl: './monaco-diff.html',
  styleUrl: './monaco-diff.scss',
})
export class MonacoDiff {
  editorInstance: any;
  searchControl: FormControl = new FormControl("");
  @Input() logDetails: any;
  kpiCardData: any;
  selectedOptions: any = [];
  intendedConfig: any = "";
  prePushConfig: any = "";
  savedConfig: any = "";
  editorTheme = "vs-light";
  intendedEditor: any;
  savedEditor: any;
  prePushEditor: any;
  configueView: boolean = false;
  postPushConfig: any = "";
  postPushEditor: any;
  electedConfigs: any[] = [];
  selectedConfigs: any[] = [];
  searchtextControl = new FormControl('');
  searchResults: any[] = [];
  currentMatchIndex: number = -1;
  modal_data: any;
  options = [
    { id: 1, name: "Pushed Config", isSelected: true },
    { id: 2, name: "Saved Config", isSelected: true },
    { id: 3, name: "Previous Config", isSelected: false },
    { id: 4, name: "Golden Config", isSelected: false },
  ];
  goldenConfig!: string;
  constructor(
    private modal: NgbModal,
  ) { }
  body = {
    search: "",
    pageNumber: 1,
    pageSize: 20,
    groupBy: [],
    filters: [],
  };
  gridOptions = {
    parentRef: this,
    context: {
      componentParent: this,
    },
  };

private diffDecorations = new Map<any, string[]>();
  ngOnInit(): void {
    this.selectedOptions = this.options.filter(x => x.isSelected);
    this.selectedConfigs = [...this.selectedOptions];
    // Base config (Saved)
    const savedConfigText = `!Software Version V800R023C00SPC500
!Last configuration was updated at 2026-04-14 15:27:29+02:00 by Prem_p
!Last configuration was saved at 2026-06-05 00:18:34+02:00 by nms_admin
#

sysname GPN-2590_JOH-ORR-TEC-SCH_NE-01
#
set neid 87c073
lldp enable-dcn authentication %^%#/vH]8;MUZ$kCQ=R-i!<-CADoCJ*zC3k]UwY)bg($%^%#
#
FTP server enable
undo FTP server-source all-interface
undo FTP ipv6 server-source all-interface
#
info-center loghost 172.31.25.125
info-center loghost 172.31.26.25
info-center loghost 172.31.252.214
info-center loghost 172.31.252.215`;
    const pushedConfigText = `!Software Version V800R023C00SPC501
!Last configuration was updated at 2026-04-14 15:27:29+02:00 by Prem_p
!Last configuration was saved at 2026-06-05 00:18:34+02:00 by nms_admin
#
loop-detect trigger enable
#
mpls ldp-srbe convergence enhance
#
clock timezone SA add 02:00:00
#
sysname GPN-2590_JOH-ORR-TEC-SCH_NE-01
#
set neid 87c073
lldp enable-dcn authentication %^%#/vH]8;MUZ$kCQ=R-i!<-CADoCJ*zC3k]UwY)bg($%^%#
#
FTP server enable
undo FTP server-source all-interface
`;

    // Previous Config (removed 2 lines)
    const previousConfigText = `!Software Version V800R023C00SPC500
!Last configuration was updated at 2026-04-14 15:27:29+02:00 by Prem_p
#
loop-detect trigger enable
#
mpls ldp-srbe convergence enhance
#
clock timezone SA add 02:00:00
#
sysname GPN-2590_JOH-ORR-TEC-SCH_NE-01
#
set neid 87c073
#
FTP server enable
undo FTP server-source all-interface
#
info-center loghost 172.31.25.125
info-center loghost 172.31.26.25
info-center loghost 172.31.252.215`;

    // Golden Config (added 2 lines)
    const goldenConfigText = `!Software Version V800R023C00SPC500
!Last configuration was saved at 2026-06-05 00:18:34+02:00 by nms_admin
!Golden version - reference config
#
loop-detect trigger enable
#
mpls ldp-srbe convergence enhance
#
clock timezone SA add 02:00:00
#
sysname GPN-2590_JOH-ORR-TEC-SCH_NE-01
#
set neid 87c073
lldp enable-dcn authentication %^%#/vH]8;MUZ$kCQ=R-i!<-CADoCJ*zC3k]UwY)bg($%^%#
#
FTP server enable
undo FTP server-source all-interface
undo FTP ipv6 server-source all-interface
FTP passive-mode
#
info-center loghost 172.31.25.125
info-center loghost 172.31.26.25
info-center loghost 172.31.252.214
info-center loghost 172.31.252.215`;

    this.savedConfig = savedConfigText;
    this.intendedConfig = pushedConfigText;
    this.prePushConfig = previousConfigText;
    this.goldenConfig = goldenConfigText;

    this.calculateDiffStats();
  }

  /**
   * @description this method get to log  list
   * @author Gurmeet Kumar
   * @returns
   */
  diffStats = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0
  };

  calculateDiffStats() {
    const saved = this.savedConfig.split('\n');
    const pushed = this.intendedConfig.split('\n');

    const savedSet = new Set(saved);
    const pushedSet = new Set(pushed);

    let added = 0, removed = 0, modified = 0, unchanged = 0;

    // Count removals
    saved.forEach((line: any) => {
      if (!pushedSet.has(line)) {
        removed++;
      } else {
        unchanged++;
      }
    });

    pushed.forEach((line: any) => {
      if (!savedSet.has(line)) {
        added++;
      }
    });
    modified = Math.min(added, removed);
    added = Math.max(0, added - modified);
    removed = Math.max(0, removed - modified);
    this.diffStats = { added, removed, modified, unchanged };
  }

  getTilesData() {
    this.kpiCardData = {
      total: 24,
      success: 18,
      warning: 4,
      failed: 2,
    };
  }
  totalRecords: any;
  showSkeleton: boolean = false;
  rowData: any[] = [];
  searchText: FormControl = new FormControl("");
  /**
   * @description this method get to log  list
   * @author Gurmeet Kumar
   * @returns
   */




  @ViewChild("viewConfig") viewConfig: any;

  openModal(event: any = null) {
    this.modal.open(this.viewConfig, {
      centered: false,
      windowClass: "execution_modal",
      backdrop: "static",
    });
    this.modal_data = {
      device_name: 'Config Preview',
      status: 'Ready',
    };

  }

  onSelect(event: any) {
    this.selectedOptions = event;

    this.selectedConfigs = this.options.filter(opt =>
      this.selectedOptions.some((sel: any) => sel.id === opt.id)
    );
  }

  get visibleConfigs() {
    return this.selectedConfigs?.length ? this.selectedConfigs : this.options;
  }

  isConfigSelected(name: string): boolean {
    return this.selectedConfigs?.some((item: any) => item.name === name);
  }

  multiSelectConfig: MultiSelectConfig = {
    idField: "id",
    textField: "name",
    disabledField: "disable",
    placeholder: "Select Option",
    prefixLabel: "",
    enableSearch: false,
    chipLimit: 2,
    selectAll: false,
    required: false,
  };

  editorOptionsNewOption: any = {
    theme: this.editorTheme,
    renderSideBySide: false,
    ignoreTrimWhitespace: false,
    renderIndicators: true,
    readOnly: true,
    lineNumbers: "on",
    enableSplitViewResizing: false,
    scrollBeyondLastLine: false,
    fontFamily: '"Lato", sans-serif',
    language: "plaintext",
    minimap: { enabled: false },
    fixedOverflowWidgets: false,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      verticalSliderSize: 8,
      horizontalSliderSize: 8,
      useShadows: false,
      alwaysConsumeMouseWheel: false,
    },
    contextmenu: false,
    clipboard: {
      copy: false,
      paste: false,
    },
    automaticLayout: true,
    renderLineHighlight: "none",
    selectionHighlight: false,
    occurrencesHighlight: "off",
    diffEditor: {
      originalEditable: false,
      renderSideBySide: true
    }
  };

  showConfigueView() {
    this.configueView = !this.configueView;
  }
onEditorInit(editor: any, type: string) {

  switch (type) {
    case "Pushed Config":
      this.intendedEditor = editor;
      break;

    case "Saved Config":
      this.savedEditor = editor;
      break;

    case "Previous Config":
      this.prePushEditor = editor;
      break;

    case "Golden Config":
      this.postPushEditor = editor;
      break;
  }

  if (
    this.intendedEditor &&
    this.savedEditor &&
    this.prePushEditor &&
    this.postPushEditor
  ) {
    setTimeout(() => {
      this.compareAllVisibleConfigs();
    }, 500);
  }
}
  copyContent(name: string) {
    const text = this.getConfigValue(name);
    navigator.clipboard.writeText(text).catch(() => {
      console.warn('Clipboard write failed');
    });
  }

  downloadFile(name: string) {
    const content = this.getConfigValue(name);
    const fileName = name.replace(/ /g, '-').toLowerCase() + '.txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  toggleTheme() {
    this.editorTheme = this.editorTheme === "vs-light" ? "vs-dark" : "vs-light";
    if (typeof monaco !== 'undefined' && monaco?.editor?.setTheme) {
      monaco.editor.setTheme(this.editorTheme);
    }
  }

  get hasIntendedConfig(): boolean {
    return !!this.intendedConfig?.trim();
  }

  get hasSavedConfig(): boolean {
    return !!this.savedConfig?.trim();
  }

  get hasPrePushConfig(): boolean {
    return !!this.prePushConfig?.trim();
  }
  get hasPostPushConfig(): boolean {
    return !!this.postPushConfig?.trim();
  }

  getConfigValue(name: string): string {
    switch (name) {
      case 'Pushed Config': return this.intendedConfig;
      case 'Saved Config': return this.savedConfig;
      case 'Previous Config': return this.prePushConfig;
      case 'Golden Config': return this.goldenConfig;
      default: return '';
    }
  }


  getAllEditors() {
    return [
      this.intendedEditor,
      this.savedEditor,
      this.prePushEditor,
      this.postPushEditor
    ].filter(Boolean);
  }
  searchAllEditors(text: string) {
    if (!text) {
      this.clearAllHighlights();
      return;
    }

    const allMatches: any[] = [];

    this.getAllEditors().forEach((editor, _editorIndex) => {
      const model = editor.getModel();
      if (!model) return;

      const matches = model.findMatches(
        text,
        true,
        false,
        false,
        null,
        true
      );

      matches.forEach((m: any) => {
        allMatches.push({
          editor,
          range: m.range
        });
      });

      const decorations = matches.map((m: any) => ({
        range: m.range,
        options: {
          inlineClassName: "global-search-highlight"
        }
      }));

      editor.deltaDecorations([], decorations);
    });

    this.searchResults = allMatches;
    this.currentMatchIndex = 0;

    this.focusMatch(0);
  }

  focusMatch(index: number) {
    if (!this.searchResults.length) return;

    const item = this.searchResults[index];
    if (!item) return;

    item.editor.revealRangeInCenter(item.range);
    item.editor.setSelection(item.range);
  }
  clearAllHighlights() {
    this.getAllEditors().forEach(editor => {
      editor.deltaDecorations([], []);
    });

    this.searchResults = [];
    this.currentMatchIndex = -1;
  }






highlightDiff(editor: any, lines: number[], type: 'added' | 'removed') {

  const oldDecorations =
    this.diffDecorations.get(editor) || [];

  const decorations = lines.map(line => ({
    range: new monaco.Range(line, 1, line, 9999),
    options: {
      isWholeLine: true,
      className:
        type === 'added'
          ? 'line-added'
          : 'line-removed'
    }
  }));

  const ids = editor.deltaDecorations(
    oldDecorations,
    decorations
  );

  this.diffDecorations.set(editor, ids);
}

compareAllVisibleConfigs() {

  if (this.visibleConfigs.length < 2) {
    return;
  }

  const baseConfig = this.visibleConfigs[0];

  const baseContent = this.getConfigValue(baseConfig.name);

  this.visibleConfigs.slice(1).forEach(config => {

    const compareContent =
      this.getConfigValue(config.name);

    const compareEditor =
      this.getEditorByName(config.name);

    this.compareWithBase(
      baseContent,
      compareContent,
      compareEditor,
      this.getEditorByName(baseConfig.name)
    );
  });
}
getEditorByName(name: string) {

  switch (name) {

    case 'Pushed Config':
      return this.intendedEditor;

    case 'Saved Config':
      return this.savedEditor;

    case 'Previous Config':
      return this.prePushEditor;

    case 'Golden Config':
      return this.postPushEditor;

    default:
      return null;
  }
}

compareWithBase(
  baseContent: string,
  compareContent: string,
  compareEditor: any,
  baseEditor: any
) {

  const baseLines = baseContent.split('\n');
  const compareLines = compareContent.split('\n');

  const addedLines: number[] = [];
  const removedLines: number[] = [];

  compareLines.forEach((line, index) => {
    if (!baseLines.includes(line)) {
      addedLines.push(index + 1);
    }
  });

  baseLines.forEach((line, index) => {
    if (!compareLines.includes(line)) {
      removedLines.push(index + 1);
    }
  });

  // Green in compare editor
  this.highlightDiff(
    compareEditor,
    addedLines,
    'added'
  );

  // Red in base editor
  this.highlightDiff(
    baseEditor,
    removedLines,
    'removed'
  );
}

myMetadataSetup = [
    [
      { label: 'Device Model', value: 'GBN-002' },
      { label: 'Checked By', value: 'Ankita Admin' }
    ],
    [
      { label: 'Network Location', value: 'Core-Spike-01' },
      { label: 'Execution Priority', value: 'High Level' }
    ]
  ];
}