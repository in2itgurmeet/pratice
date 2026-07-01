import { Routes } from '@angular/router';
import { Forms } from './component/forms/forms';
import { TableView } from './component/table-view/table-view';


export const routes: Routes = [
{
  path:'',
  component:Forms
},
{
  path:'table-view',
  component:TableView
}

];
