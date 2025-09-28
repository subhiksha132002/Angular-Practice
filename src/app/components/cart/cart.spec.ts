import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Cart } from './cart';


describe('Cart Component', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let httpMock: HttpTestingController;

  const mockCartItems = [
    {
      productId: 1,
      productName: 'Test Product 1',
      productPrice: 100,
      quantity: 2,
      productImageUrl: 'https://example.com/image1.jpg'
    },
    {
      productId: 2,
      productName: 'Test Product 2',
      productPrice: 50,
      quantity: 1,
      productImageUrl: 'https://example.com/image2.jpg'
    }
  ];

  const mockApiResponse = {
    data: mockCartItems,
    message: 'Success',
    result: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } catch (e) {
    }
  });

  it('should create the component', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.loading()).toBe(true);
    expect(component.error()).toBe(null);
    expect(component.products()).toEqual([]);
    expect(component.orderPlaced()).toBe(false);

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);
  });

  it('should load cart items successfully', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    expect(component.products()).toEqual(mockCartItems);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(null);
  });

  it('should handle API error when loading cart items', () => {
    spyOn(console, 'error'); 

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    expect(component.error()).toBe('Failed to fetch products');
    expect(component.loading()).toBe(false);
    expect(component.products()).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('should calculate total price correctly', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    // Calculate expected total: (100 * 2) + (50 * 1) = 250
    const expectedTotal = 250;
    const actualTotal = component.calculateTotalPrice();

    expect(actualTotal).toBe(expectedTotal);
  });

  it('should return 0 for empty cart total price', () => {
    const emptyResponse = { data: [], message: 'Success', result: true };
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(emptyResponse);

    const total = component.calculateTotalPrice();
    expect(total).toBe(0);
  });

  it('should handle single item price calculation', () => {
    const singleItemResponse = {
      data: [{ productId: 1, productName: 'Single Product', productPrice: 75, quantity: 3 }],
      message: 'Success',
      result: true
    };

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(singleItemResponse);

    // Expected: 75 * 3 = 225
    const total = component.calculateTotalPrice();
    expect(total).toBe(225);
  });

  it('should place order successfully', () => {
    spyOn(window, 'alert'); 

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    expect(component.products().length).toBe(2);
    expect(component.orderPlaced()).toBe(false);

    component.placeOrder();

    expect(window.alert).toHaveBeenCalledWith('Order Placed Successfully');
    expect(component.orderPlaced()).toBe(true);
    expect(component.products()).toEqual([]); 
  });

  it('should clear cart after placing order', () => {
    spyOn(window, 'alert');

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    expect(component.products().length).toBeGreaterThan(0);

    component.placeOrder();

    expect(component.products().length).toBe(0);
  });

  it('should set orderPlaced flag when order is placed', () => {
    spyOn(window, 'alert');

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    // Initially order should not be placed
    expect(component.orderPlaced()).toBe(false);

    // Place order
    component.placeOrder();

    // Order should now be marked as placed
    expect(component.orderPlaced()).toBe(true);
  });

  
  it('should display cart items when loaded', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    
    // Check if shopping cart title is displayed
    const cartTitle = compiled.querySelector('.title');
    expect(cartTitle?.textContent?.trim()).toContain('Shopping Cart');

    // Check if product names are displayed
    const productElements = compiled.querySelectorAll('.main');
    expect(productElements.length).toBe(2);
  });

  it('should show order placed message when order is placed', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    spyOn(window, 'alert');
    component.placeOrder();

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const orderMessage = compiled.querySelector('.alert-info');
    
    expect(orderMessage).toBeTruthy();
    expect(orderMessage?.textContent?.trim()).toContain('Your cart is empty. Thank you for your order!');
  });

  it('should display total price in summary', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const summaryContent = compiled.querySelector('.summary-content');
    
    expect(summaryContent).toBeTruthy();
    expect(summaryContent?.textContent).toContain('Total Items:');
    expect(summaryContent?.textContent).toContain('Total Price:');
  });

  it('should display correct number of total items', () => {
    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('2'); 
  });

  it('should call placeOrder when place order button is clicked', () => {
    spyOn(component, 'placeOrder');

    const req = httpMock.expectOne('https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems');
    req.flush(mockApiResponse);

    fixture.detectChanges();

    const placeOrderButton = fixture.nativeElement.querySelector('button');
    placeOrderButton.click();

    expect(component.placeOrder).toHaveBeenCalled();
  });
  
});