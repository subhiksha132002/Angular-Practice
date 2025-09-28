import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layout } from './layout';
import { provideRouter,RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';


describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout,],
      providers:[
        provideRouter([
          {path:'products',component: DummyComponent},
          {path:'add-product',component: DummyComponent},
          {path:'cart',component: DummyComponent}

        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render navbar brand text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector('.navbar-brand');
    expect(brand?.textContent).toContain('Online Retail Shop');
  });

  it('should have 3 routerLinks in navbar',() => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref)).filter(de => de.nativeElement.classList.contains('nav-link'));
    expect(links.length).toBe(3);

    const routerLinks = links.map(de => de.injector.get(RouterLinkWithHref));

    expect(routerLinks[0].href).toContain('/products');
    expect(routerLinks[1].href).toContain('/add-product');
    expect(routerLinks[2].href).toContain('/cart');

  });
});

import { Component } from '@angular/core';
@Component({template: ''})
class DummyComponent {}
