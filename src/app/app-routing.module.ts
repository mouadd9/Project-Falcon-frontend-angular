import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure the router with the global routes
  exports: [RouterModule] // Make router directives available
}) // after we configured the router now Angular knows which component to render in the router-outlet tag
export class AppRoutingModule { }


/*
In a single-page app, you change what the user sees 
by showing or hiding portions of the display that correspond to particular components,
rather than going out to the server to get a new page.

As users perform application tasks, 
they need to move between the different views that you have defined.

To handle the navigation from one view to the next, you use the Angular Router.
The Router enables navigation by interpreting a browser URL as an instruction to change the view.

*/