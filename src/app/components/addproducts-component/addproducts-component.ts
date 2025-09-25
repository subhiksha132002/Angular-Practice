import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductModel, APIResponse } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addproducts-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addproducts-component.html',
  styleUrls: ['./addproducts-component.css']
})
export class AddproductsComponent implements OnInit {

  productForm!: FormGroup;
  router = inject(Router);
  private apiUrl = "https://freeapi.miniprojectideas.com/api/amazon/CreateProduct";

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      ProductName: ["", Validators.required],
      ProductSku: ["", [Validators.required, Validators.maxLength(5)]],
      ProductPrice: [0, [Validators.required, Validators.min(1)]],
      ProductShortName: [""],
      ProductDescription: [""],
      CreatedDate: [new Date().toISOString()],
      DeliveryTimeSpan: ["", Validators.required],
      CategoryId: [0],
      ProductImageUrl: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const productData: ProductModel = {
        ProductId: 0,
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
      ProductSku: "",
      ProductPrice: 0,
      ProductShortName: "",
      ProductDescription: "",
      CreatedDate: new Date().toISOString(),
      DeliveryTimeSpan: "",
      CategoryId: 0,
      ProductImageUrl: ""
    });
  }
}
