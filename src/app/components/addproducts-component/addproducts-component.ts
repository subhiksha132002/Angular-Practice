import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductModel, APIResponse } from '../../models/product';

@Component({
  selector: 'app-addproducts-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addproducts-component.html',
  styleUrls: ['./addproducts-component.css']
})
export class AddproductsComponent implements OnInit {

  productForm!: FormGroup;
  router = inject(Router);
  private apiUrl = "http://localhost:5160/api/Products";

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      ProductName: ["", Validators.required],
      ProductPrice: [0, [Validators.required, Validators.min(1)]],
      ProductDescription: [""],
      StockQuantity:[0, [Validators.required, Validators.min(1)]],
      ImageUrl: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const productData: ProductModel = {
        ...this.productForm.value
      };

      this.http.post<APIResponse>(this.apiUrl, productData).subscribe({
        next: (res) => {
          console.log("Product created Successfully", res);
          alert("Product created Successfully!");
          this.resetForm();
        },
        error: (err) => {
          console.error("Error creating product", err);
          alert("Failed to create Product");
        }
      });
    } else {
      alert("Please fill in all required fields");
    }
  }

  resetForm(): void {
    this.productForm.reset({
      ProductName: "",
      ProductPrice: 0,
      ProductDescription: "",
      StockQuantity: 0,
      ImageUrl: ""
    });
  }
}
