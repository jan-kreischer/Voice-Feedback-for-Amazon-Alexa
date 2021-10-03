import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback';
import { Product } from '../models/product';
import{ GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  apiUrl = GlobalConstants.apiUrl;

  getProduct(product_id: number) {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/product/${product_id}`);
  }
  
  getProducts() {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`);
  }
  
  getProductFeedback(product_id: number) {
    var url = `https://api.myfeedbackbot.com/product/${product_id}/feedback`
    console.log("URL " + url) 
    return this.httpClient.get<Feedback[]>(url);
  }
  
  constructor(private httpClient: HttpClient) { }
}
