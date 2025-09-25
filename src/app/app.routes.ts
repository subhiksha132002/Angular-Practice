import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products-component/products-component';
import {AddproductsComponent}  from './components/addproducts-component/addproducts-component';
import { Layout } from './components/layout/layout';
import { Cart } from './components/cart/cart';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'products',
        pathMatch:'full'
    },
 
    {
        path:'',
        component: Layout,
        children: [
        {
            path : 'products',
            component : ProductsComponent
        },
        {
            path : 'add-product',
            component : AddproductsComponent
        },
        {
            path : 'cart',
            component : Cart
        }
        

],
}
];
