import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShortenPipe } from './pipes/shorten.pipe';
import { UsernamePipe } from './pipes/username.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { GlowEffectDirective } from './directives/glow-effect.directive';

@NgModule({
  declarations: [
    ShortenPipe, // shorten long texts
    UsernamePipe,
    TimeAgoPipe, // to transform dates to descriptif texts 
    HighlightDirective,
    GlowEffectDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule,
    ShortenPipe,
    UsernamePipe,
    TimeAgoPipe,
    HighlightDirective,
    GlowEffectDirective
  ]
// in a lot of times this module will be used to only export Modules without impoting them !!
// When you export a module directly without importing it, you’re essentially saying:
//"I don’t need to use this module in the Shared Module itself, but I want to make it available to any module that imports the Shared Module."
/*
This is common for third-party modules or Angular built-in modules (e.g., CommonModule, FormsModule, ReactiveFormsModule)
that are already well-defined and don’t need to be used directly in the Shared Module.
*/
})
export class SharedModule { }


/* 
SharedModule permet de mettre à disposition les éléments qui sont des dépendances partagées par plusieurs modules de l'application.

Cela permet de garder des feature modules plus propres, et importer SharedModule une fois ou plusieurs fois ne change en rien la taille du bundle final de l'application : en vrai, il n'y a qu'une "copie" de SharedModule qui est "partagée" par les modules qui l'importent !
*/

/*this module will only export Modules without impoting them !! */
