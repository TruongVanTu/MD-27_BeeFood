import { ADD_PRODUCT_TO_CART } from "./Type";

export const addproducttocart = (product)=>{
    return {
        type: ADD_PRODUCT_TO_CART ,
        payload: product
    }
}