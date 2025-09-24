import { Component,inject } from '@angular/core';
import { APIResponse,ProductModel } from '../../models/product';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-addproducts-component',
  imports: [FormsModule],
  templateUrl: './addproducts-component.html',
  styleUrl: './addproducts-component.css'
})
export class AddproductsComponent {
  newProductObj:ProductModel;

  http = inject(HttpClient);
  router = inject(Router);
  constructor(){
    this.newProductObj = new ProductModel();
  }

 onSaveProduct(productForm: NgForm) {
    if (!productForm.valid) {
      alert('Please fill in all the required fields!');
      return;
    }


    this.http.post<APIResponse>("https://freeapi.miniprojectideas.com/api/amazon/CreateProduct", this.newProductObj)
      .subscribe((res: APIResponse) => {
        if (res.result) {
          alert("Product Created Successfully");

          
          this.router.navigate(['/products']);
        } else {
          alert(res.message); 
        }
      });
  }

  
  onReset(form: NgForm) {
    form.reset();  
    this.newProductObj = new ProductModel();  
  }

}
