import { Routes } from '@angular/router';
import { UsersTable } from './users-table/users-table';
import { UserCards } from './user-cards/user-cards';
import { Forms } from './forms/forms';
import { SingleSelectCustomComponent } from './coustom/single-select-coustom/single-select-coustom';
import { Echart } from './echart/echart';
import { MultilineChart } from './multiline-chart/multiline-chart';
import { FormPractice } from './form/form';
import { MonacoEditor } from './monaco-editor/monaco-editor';
import { MonacoDiff } from './monaco-diff/monaco-diff';

export const routes: Routes = [
  { path: '', component:MonacoDiff  },
  // { path: '', redirectTo: 'usersform', pathMatch: 'full' },
  // { path: 'usersform', component: Forms },
  // { path: 'users', component: UsersTable },
  // { path: 'cards', component: UserCards },

];
