import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './components/editor/editor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'editor/:id', component: EditorComponent },
  { path: '**', redirectTo: '' }
];