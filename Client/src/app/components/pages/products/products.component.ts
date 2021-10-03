import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product'
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  products: Product[];

  constructor(private productService: ProductService) {
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {this.products = data});
  }

  ngOnInit() {
    this.getProducts();
  }
}
