import {useEffect,useState} from "react";
import API from "../services/api";

function Products(){

 const [products,setProducts]=useState([]);

 useEffect(()=>{

  API.get("/products")
     .then(res=>setProducts(res.data));

 },[]);

 return(

  <div>

   <h1>Products</h1>

   <table>

    <thead>
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
      </tr>
    </thead>

    <tbody>

      {products.map(product=>(

        <tr key={product._id}>
          <td>{product.name}</td>
          <td>{product.price}</td>
          <td>{product.stock}</td>
        </tr>

      ))}

    </tbody>

   </table>

  </div>
 );
}

export default Products;