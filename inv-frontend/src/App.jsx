import { Routes, Route } from 'react-router-dom';
import ProductTypeItems from './components/ProductTypeItems';

<Routes>
  <Route path="/product-types/:productTypeId/items" element={<ProductTypeItems />} />
</Routes> 