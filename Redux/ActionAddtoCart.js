import { ADD_PRODUCT_TO_CART, DELETE_PRODUCT } from "./Type";

export const addproducttocart = (product)=>{
    return {
        type: ADD_PRODUCT_TO_CART ,
        payload: product
    }
}

export const deleteproduct = (productid)=>{
    return{
        type:DELETE_PRODUCT , 
        payload:productid
    }
}