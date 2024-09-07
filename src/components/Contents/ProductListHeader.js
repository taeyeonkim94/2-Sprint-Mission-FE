import CategoryTitle from "./CategoryTitle.js";
import "./style/ProductListHeader.css";
import SortSelector from "./SortSelector.js";
function ProductListHeader() {
  return (
    <div id="product-list-header">

      <CategoryTitle>판매 중인 상품</CategoryTitle>
      <div id="search-sort-box">
        <div id="search-box">
          <input id="search-input"></input>
          <button id="register-btn">상품 등록하기</button>
        </div>
        <SortSelector />
      </div>

    </div>
  );
}
export default ProductListHeader;
