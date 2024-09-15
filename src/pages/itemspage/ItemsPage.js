import styles from "./ItemsPage.module.css";
import Contents from "./Contents.js";
import { useEffect, useState } from "react";
import getProducts from "../../api/ProductService.js";

function ItemsPage() {
  const [bestList, setBestList] = useState([]);
  const [sellingList, setSellingList] = useState([]);
  const [order, setOrder] = useState("recent");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const PC_WIDTH = 1200;
  const TABLET_WIDTH = 744;

  const getPageSize = (width) => {
    if (width > PC_WIDTH)
      return {
        bestList: 4,
        sellingList: 10
      };
    if (width > TABLET_WIDTH)
      return {
        bestList: 2,
        sellingList: 6
      };
    return {
      bestList: 1,
      sellingList: 4
    };
  };
  const [pageSize, setPageSize] = useState(getPageSize(window.innerWidth));

  useEffect(() => {
    const onResize = () => {
      setPageSize(getPageSize(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleBestLoad = async (options) => {
    const { list, totalCount } = await getProducts(options);
    setBestList(list);
  };
  const handleSellingLoad = async (options) => {
    const { list, totalCount } = await getProducts(options);
    setSellingList(list);
    const nextTotalPage = Math.ceil(totalCount / options.pageSize);
    setTotalPage(nextTotalPage);
  };
  const handleChangePage = async (pageValue) => {
    setCurrentPage(pageValue);
    const options = {
      page: pageValue,
      pageSize: pageSize.sellingList,
      orderBy: order
    };
    console.log("바뀌는 페이지 정보");
    console.log(`page: ${options.page}`);
    console.log(`pageSize: ${options.pageSize}`);
    console.log(`orderyBy: ${options.orderBy}`);
    console.log(`totalPage: ${totalPage}`);
  };
  const handleChangeOrder = (chosenOrder) => {
    setOrder(chosenOrder);
  };
  const handleChangeKeyword = (inputKeyword) => setKeyword(inputKeyword);

  useEffect(() => {
    handleBestLoad({ pageSize: pageSize.bestList, orderBy: "favoriteCount" });
    handleSellingLoad({
      page: currentPage,
      pageSize: pageSize.sellingList,
      orderBy: order,
      keyword
    });
  }, [order, currentPage, keyword, pageSize.bestList]);

  const totalList = {
    bestList,
    sellingList
  };
  const pageInfo = {
    currentPage,
    totalPage,
    pageSize
  };
  return (
    <div className={styles.itemsPage}>
      <Contents
        className={styles.margin}
        totalList={totalList}
        pageInfo={pageInfo}
        onChangePage={handleChangePage}
        onChangeOrder={handleChangeOrder}
        onChangeKeyword={handleChangeKeyword}
      />
    </div>
  );
}

export default ItemsPage;
