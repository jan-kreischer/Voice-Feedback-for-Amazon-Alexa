import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FeedbackComponent } from './components/pages/feedback/feedback.component';
import { ProductComponent } from './components/pages/product/product.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { FeedbacksComponent } from './components/pages/feedbacks/feedbacks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackOverviewComponent } from './components/tables/feedback-overview/feedback-overview.component';
import { FeedbackRepliesComponent } from './components/tables/feedback-replies/feedback-replies.component';
import { BackButtonComponent } from './components/buttons/back-button/back-button.component';
import { DeleteFeedbackButtonComponent } from './components/buttons/delete-feedback-button/delete-feedback-button.component';
import { FeedbackOverviewTableComponent } from './components/tables/feedback-overview-table/feedback-overview-table.component';
import { FeedbackContactTableComponent } from './components/tables/feedback-contact-table/feedback-contact-table.component';
import { ProcessFeedbackButtonComponent } from './components/buttons/process-feedback-button/process-feedback-button.component';
import { FeedbackDetailComponent } from './components/tables/feedback-detail/feedback-detail.component';

const appRoutes: Routes = [
  {
    path: 'feedback',
    component: FeedbacksComponent,
    data: { title: 'Feedback' }
  },
  { 
    path: 'feedback/:feedback_id',      
    component: FeedbackComponent,
  },
  {
    path: 'product/:product_id',
    component: ProductComponent,
    data: { title: 'Product List' }
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Product List' }
  },
];

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    ProductComponent,
    ProductsComponent,
    FeedbacksComponent,
    FeedbackOverviewComponent,
    FeedbackRepliesComponent,
    BackButtonComponent,
    DeleteFeedbackButtonComponent,
    FeedbackOverviewTableComponent,
    FeedbackContactTableComponent,
    ProcessFeedbackButtonComponent,
    FeedbackDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 { }
