import { Component, OnInit } from '@angular/core'
import { Product } from '../../../models/product'
import { Feedback } from '../../../models/feedback'
import { ActivatedRoute } from '@angular/router'
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  //template: '<app-feedback-overview [feedback]=feedbacks[0]></app-feedback-overview>',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product;
  feedbacks: Feedback[];
  
  constructor
  (
    private route: ActivatedRoute,
    private productService: ProductService,
  ) 
  {
    this.route.params.subscribe( params => console.log(params) );
  }
  
  
  getProduct(): void {
    const product_id = +this.route.snapshot.paramMap.get('product_id');
    this.productService.getProduct(product_id).subscribe((data: Product[]) => this.product = data[0]);
  }
  
  getProductFeedback(): void {
    const product_id = +this.route.snapshot.paramMap.get('product_id');
    console.log("getProductFeedback product_id:" + product_id)
    this.productService.getProductFeedback(product_id).subscribe((data: Feedback[]) => {console.log(data); this.feedbacks = data});
  }

  ngOnInit() {
    this.getProduct();
    this.getProductFeedback();
  }

}
