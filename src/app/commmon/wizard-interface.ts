import { Type } from '@angular/core';

export interface WizardInterface {
  component: Type<any>;
  title: string;
  data?: any;
}
