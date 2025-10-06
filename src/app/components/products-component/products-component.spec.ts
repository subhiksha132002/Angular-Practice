import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ProductsComponent } from './products-component';


describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let httpMock: HttpTestingController;

  const mockProducts = [
    {
      productId: 1,
      productName: 'Test Product 1',
      productPrice: 100,
      productImageUrl: 'https://example.com/image1.jpg'
    },
    {
      productId: 2,
      productName: 'Test Product 2',
      productPrice: 200,
      productImageUrl: 'https://example.com/image2.jpg'
    }
  ];

  const mockApiResponse = {
    data: mockProducts,
    message: 'Success',
    result: true
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBe(true);
    expect(component.error()).toBe(null);
    expect(component.products()).toEqual([]);
  });


  it('should load products successfully', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    expect(component.products()).toEqual(mockProducts);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(null);
  });

  it('should initialize quantity map when products are loaded', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    expect(component.quantityMap[1]).toBe(1);
    expect(component.quantityMap[2]).toBe(1);
  });

  it('should handle API error when loading products', () => {
    spyOn(console, 'error'); 

    fixture.detectChanges();

    // Simulate HTTP error
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(component.error()).toBe('Failed to fetch products');
    expect(component.loading()).toBe(false);
    expect(component.products()).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  
  it('should increase product quantity', () => {
    // Set up component with products first
    fixture.detectChanges(); 
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    expect(component.quantityMap[1]).toBe(1);

    // Increase quantity
    component.increaseQuantity(1);
    expect(component.quantityMap[1]).toBe(2);

    // Increase again
    component.increaseQuantity(1);
    expect(component.quantityMap[1]).toBe(3);
  });

  it('should decrease product quantity', () => {
    fixture.detectChanges(); 
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    component.quantityMap[1] = 3;

    // Decrease quantity
    component.decreaseQuantity(1);
    expect(component.quantityMap[1]).toBe(2);

    // Decrease again
    component.decreaseQuantity(1);
    expect(component.quantityMap[1]).toBe(1);
  });

  it('should not decrease quantity below 1', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    expect(component.quantityMap[1]).toBe(1);

    component.decreaseQuantity(1);
    expect(component.quantityMap[1]).toBe(1); 
  });

  it('should add product to cart successfully', () => {
    spyOn(window, 'alert'); 

    fixture.detectChanges(); 
    const req1 = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req1.flush(mockApiResponse);

    component.quantityMap[1] = 2;

    const testProduct = mockProducts[0];
    component.addToCart(testProduct);

    const req2 = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/AddToCart');
    expect(req2.request.method).toBe('POST');

    const expectedCartItem = {
      CartId: 0,
      CustId: 0,
      ProductId: 1,
      Quantity: 2,
      AddedDate: jasmine.any(String)
    };
    expect(req2.request.body).toEqual(expectedCartItem);

    const mockCartResponse = { message: 'Added to cart', result: true };
    req2.flush(mockCartResponse);

    expect(window.alert).toHaveBeenCalledWith('Product added to cart');
  });

  it('should handle add to cart error', () => {
    spyOn(window, 'alert');
    spyOn(console, 'error');

    fixture.detectChanges(); 
    const req1 = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req1.flush(mockApiResponse);

    const testProduct = mockProducts[0];
    component.addToCart(testProduct);

    // Simulate HTTP error for add to cart
    const req2 = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/AddToCart');
    req2.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to add product to cart');
  });


  it('should show loading spinner when loading', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const spinner = compiled.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();

    // Complete the HTTP request to stop loading
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);
  });

  it('should show error message when there is an error', () => {
    fixture.detectChanges();
    
    // Simulate error
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.error(new ProgressEvent('error'));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorAlert = compiled.querySelector('.alert-danger');
    expect(errorAlert).toBeTruthy();
    expect(errorAlert.textContent?.trim()).toBe('Failed to fetch products');
  });

  it('should display products when loaded successfully', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const productCards = compiled.querySelectorAll('.card');
    expect(productCards.length).toBe(2);

    const productNames = compiled.querySelectorAll('.card-title');
    expect(productNames[0].textContent?.trim()).toBe('Test Product 1');
    expect(productNames[1].textContent?.trim()).toBe('Test Product 2');
  });

  it('should call increaseQuantity when plus button is clicked', () => {
    spyOn(component, 'increaseQuantity');

    fixture.detectChanges();
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const plusButton = fixture.nativeElement.querySelector('.fa-plus').closest('button');
    plusButton.click();

    expect(component.increaseQuantity).toHaveBeenCalledWith(1);
  });

  it('should call decreaseQuantity when minus button is clicked', () => {
    spyOn(component, 'decreaseQuantity');

    fixture.detectChanges();
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const minusButton = fixture.nativeElement.querySelector('.fa-minus').closest('button');
    minusButton.click();

    expect(component.decreaseQuantity).toHaveBeenCalledWith(1);
  });

});