import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AddproductsComponent } from './addproducts-component';
import { ProductModel, APIResponse } from '../../models/product';



describe('AddproductsComponent', () => {

  let component: AddproductsComponent;
  let fixture: ComponentFixture<AddproductsComponent>;
  let httpMock: HttpTestingController; 
  let mockRouter: jasmine.SpyObj<Router>; 


  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AddproductsComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AddproductsComponent);
    component = fixture.componentInstance;


    httpMock = TestBed.inject(HttpTestingController);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });


  afterEach(() => {
    httpMock.verify();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct default values', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('ProductName')?.value).toBe('');
    expect(component.productForm.get('ProductPrice')?.value).toBe(0);
    expect(component.productForm.get('ProductSku')?.value).toBe('');

  });

  it('should show form as invalid when required fields are empty', () => {
    expect(component.productForm.invalid).toBeTruthy();
  });

  it('should show form as valid when all required fields are filled', () => {
    component.productForm.patchValue({
      ProductName: 'Test Product',
      ProductSku: 'TP001',
      ProductPrice: 50,
      CreatedDate: '2024-01-01',
      DeliveryTimeSpan: '2-3 days',
      ProductImageUrl: 'https://example.com/image.jpg'
    });

    expect(component.productForm.valid).toBeTruthy();
  });

  it('should reject invalid ProductSku (more than 5 characters)', () => {
    const skuControl = component.productForm.get('ProductSku');

    skuControl?.setValue('12345');
    expect(skuControl?.valid).toBeTruthy();

    skuControl?.setValue('123456');
    expect(skuControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should reject invalid ProductPrice (0 or negative)', () => {
    const priceControl = component.productForm.get('ProductPrice');

    priceControl?.setValue(0);
    expect(priceControl?.hasError('min')).toBeTruthy();

    priceControl?.setValue(10);
    expect(priceControl?.valid).toBeTruthy();
  });

  it('should not submit form when validation fails', () => {
    spyOn(window, 'alert');

    // Try to submit empty form
    component.onSubmit();


    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
    httpMock.expectNone('https://freeapi.miniprojectideas.com/api/amazon/CreateProduct');
  });

  it('should successfully submit valid form data', () => {

    spyOn(window, 'alert');

    const validProduct = {
      ProductName: 'Test Product',
      ProductSku: 'TP001',
      ProductPrice: 100,
      ProductShortName: 'Test',
      ProductDescription: 'A test product',
      CreatedDate: '2024-01-01',
      DeliveryTimeSpan: '2-3 days',
      CategoryId: 1,
      ProductImageUrl: 'https://example.com/image.jpg'
    };

    component.productForm.patchValue(validProduct);

    const mockResponse: APIResponse = {
      message: 'Success',
      result: true,
      data: validProduct
    };

    component.onSubmit();

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/CreateProduct');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(validProduct);

    req.flush(mockResponse);

    expect(window.alert).toHaveBeenCalledWith('Product created Successfully!');
  });

  it('should handle server errors gracefully', () => {

    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.productForm.patchValue({
      ProductName: 'Test Product',
      ProductSku: 'TP001',
      ProductPrice: 100,
      CreatedDate: '2024-01-01',
      DeliveryTimeSpan: '2-3 days',
      ProductImageUrl: 'https://example.com/image.jpg'
    });

    component.onSubmit();

    // Simulate server error
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/CreateProduct');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to create Product');
  });

  it('should reset form when reset button is clicked', () => {
    component.productForm.patchValue({
      ProductName: 'Test Product',
      ProductPrice: 100
    });

    component.resetForm();

    expect(component.productForm.get('ProductName')?.value).toBe('');
    expect(component.productForm.get('ProductPrice')?.value).toBe(0);
  });


  it('should render all required form fields', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('input[formControlName="ProductName"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="ProductSku"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="ProductPrice"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="button"]')).toBeTruthy();
  });

  it('should show error message when required field is empty and touched', () => {
    component.productForm.get('ProductName')?.setValue('');
    component.productForm.get('ProductName')?.markAsTouched();

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorElements = compiled.querySelectorAll('.text-danger');

    let errorFound = false;
    errorElements.forEach((element: Element) => {
      if (element.textContent?.includes('Product name is required')) {
        errorFound = true;
      }
    });

    expect(errorFound).toBeTruthy();
  });

});