import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import useGetData from "@/lib/hooks/useGetData";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MODEL_TYPE, BUTTON_TYPE, CRUDAction } from "@/constants";
import EditDeleteDropDown from "@/components/EditDeleteDropDown";
import CommentItem from "@/components/CommentItem";
import convertDate from "@/utils/convertDate";
import { useAuth } from "@/contexts/AuthProvider";
import { useError } from "@/contexts/ErrorProvider";
import { tenaryWithEmpty } from "@/utils/ternaryUtils";
import {
  deleteProduct,
  postProductComment,
  patchProductComment,
  deleteProductComment,
  getProduct,
  getProductComments
} from "@/api/api";
import Modal from "@/components/Modal";
const { PRODUCT_WITH_COMMENTS } = MODEL_TYPE;
export default function Product() {
  const router = useRouter();
  const { handleError } = useError();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["productInfo", id],
    queryFn: () => getProduct(id),
    enabled: !!id
  });
  const {
    data: commentsData,
    isPending: commentsIsPending,
    isError: commentsIsError
  } = useQuery({
    queryKey: ["productComments", id],
    queryFn: () => getProductComments({ id, params: { limit: 3 } }),
    enabled: !!id
  });
  const { user } = useAuth(true);
  const commentsPostMutation = useMutation({
    mutationFn: async () => {
      const submitData = {
        content: inputComment
      };
      if (user) {
        const response = await postProductComment({ id, formData: submitData });
      } else {
        router.push("/login");
        handleError(new Error("댓글 작성은 로그인이 필요합니다"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productComments", id] });
      setInputComment("");
    },
    onError: (e) => handleError(e)
  });
  const commentsDeleteMutation = useMutation({
    mutationFn: async (deletedId) => {
      try {
        await deleteProductComment(deletedId);
      } catch (e) {
        handleError(new Error("삭제 실패"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productComments", id] });
      setInputComment("");
    },
    onError: (e) => handleError(e)
  });
  const product = data?.data;
  const { list: productComments } = commentsData?.data || {};
  const [inputComment, setInputComment] = useState();
  const [isPost, setIsPost] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (inputComment === "") setIsPost(false);
    else setIsPost(true);
  }, [inputComment]);

  const handleDropdownChange = (chosenOption) => {
    try {
      if (product.ownerId !== user.id) throw new Error("권한이없습니다");
      if (chosenOption === BUTTON_TYPE.edit.value)
        router.push(`/items/write/${id}`);
      else if (chosenOption === BUTTON_TYPE.delete.value) setModalOpen(true);
    } catch (e) {
      handleError(e);
    }
  };
  const handleChangeComment = (e) => setInputComment(e.target.value);
  const postComment = async () => {
    const submitData = {
      content: inputComment
    };
    if (user) {
      const response = await postProductComment({ id, formData: submitData });
    } else {
      router.push("/login");
      handleError(new Error("댓글 작성은 로그인이 필요합니다"));
    }
  };
  const patchComment = async ({ id, formData }) => {
    try {
      const response = await patchProductComment({ id, formData });
    } catch (e) {
      handleError(new Error("수정 실패"));
    }
  };
  const handleDeleteComment = async (deletedId) => {
    try {
      const response = await deleteProductComment(deletedId);
    } catch (e) {
      handleError(new Error("삭제 실패"));
    }
  };
  const handleCloseModle = () => setModalOpen(false);
  const handleModalComplete = () => {
    deleteProduct(product.id);
    router.push("/items");
  };
  const isComments = productComments?.length === 0;
  if (!id) return null;
  return (
    <div className="w-full flex justify-center">
      <div
        className="w-[1200px] mt-[24px] mb-[277px] flex flex-col items-center
      md:w-[696px] md:mb-[298px]
      sm:w-[344px] sm:mt-[16px] sm:mb-[139px]"
      >
        <div
          className="w-full h-[496px] lg:mt-[5px] flex justify-between sm:flex-col
        md:h-[484px]
        sm:h-[827px]"
        >
          <div
            className="w-[486px] h-[486px] relative
          md:w-[340px] md:h-[340px]
          sm:w-full sm:h-[343px]"
          >
            <img
              src={product?.images}
              className="w-full h-full"
              alt="상품이미지"
            />
          </div>
          <div className="w-[690px] h-full flex flex-col md:w-[340px] sm:w-full sm:h-[468px]">
            <div className="w-full h-[32px] sm:h-[26px] flex justify-between">
              <h1
                className="h-full text-[24px] leading-32px font-semibold text-1f2937
                md:text-[20px]sm:text-[16px] sm:leading-26px"
              >
                {product?.name}
              </h1>
              <EditDeleteDropDown onDropDownChange={handleDropdownChange} />
            </div>
            <span
              className="h-[48px] text-[40px] font-semibold leading-47.73px mt-[16px]
            md:h-[42px] md:text-[32px] md:leading-42px md:mt-[8px]
            sm:h-[32px] sm:text-[24px] sm:leading-32px sm:mt-[8px]"
            >
              {product?.price?.toLocaleString()}
            </span>
            <div className="h-[1px] w-full mt-[16px] bg-e5e7eb"></div>
            {/* 구분선 */}
            <span
              className="w-full h-[26px] mt-[16px] text-[16px] font-semibold leading-26px text-4B5563
              lg:mt-[24px]
              md:h-[24px] md:text-[14px] md:leading-24px
              sm:h-[24px] sm:text-[14px] sm:leading-24px"
            >
              상품소개
            </span>
            <div
              className="w-full h-[128px] text-[16px] leading-26px mt-[8px] text-4b5563 lg:mt-[16px]
            md:h-[212px] sm:h-[180px]"
            >
              {product?.description}
            </div>
            <div
              className="w-full h-[24px] text-[16px] leading-26px font-semibold text-4b5563 lg:h-[26px]
            md:text-[14px] md:leading-24px
            sm:text-[14px] sm:leading-24px"
            >
              상품 태그
            </div>
            <div className="w-full h-[36px] mt-[8px] lg:mt-[16px] flex gap-[8px] whitespace-nowrap">
              {product?.tags?.map((tag) => (
                <div
                  className="h-full leading-26px px-[16px] py-[6px] rounded-[26px] bg-f3f4f6"
                  key={tag}
                >
                  #{tag}
                </div>
              ))}
            </div>
            <div className="w-full h-[50px] mt-[40px] lg:mt-[62px] items-center flex">
              <Image
                width={40}
                height={40}
                src="/images/ic_big_profile.png"
                alt="프로필 이미지"
                style={{ objectFit: "cover" }}
              />
              <div className="h-full flex flex-col ml-[24px]">
                <span className="w-[69px] h-[24px] text-[14px] leading-24px text-4b5563">
                  {product?.ownerNickname}
                </span>
                <span className="w-[80px] h-[24px] text-[14px] leading-24px text-9ca3af whtiespace-nowrap">
                  {convertDate(product?.createdAt)}
                </span>
              </div>
              <div
                className="h-[34px] ml-[445px] mr-[24px] border-l border-e5e7eb
              md:ml-[93px] sm:ml-[97px]"
              ></div>
              {/*구분선*/}
              <button
                className="w-[87px] h-[40px] flex items-center gap-[4px] px-[12px] py-[4px] rounded-[35px] border-[1px]
                md:w-[79px] md:h-[32px]
                sm:w-[79px] sm:h-[32px]"
              >
                <Image
                  width={20.1}
                  height={17.48}
                  src="/images/ic_bigheart.png"
                  alt="하트이미지"
                />
                <span className="text-[16px] leading-26px text-6b7280">
                  {product?.favoriteCount}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full mt-[40px] md:mt-[32px] sm:mt-[24px] border-t border-e5e7eb"></div>
        {/*구분선*/}
        <form className="w-full h-[197px] sm:h-[229px] flex flex-col mt-[40px] sm:mt-[24px]">
          <label htmlFor="productPostComment">문의하기</label>
          <textarea
            id="productPostComment"
            onChange={handleChangeComment}
            value={inputComment}
            placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다"
            spellCheck="false"
            className="w-full h-[104px] sm:h-[120px] rounded-[12px] px-[24px] py-[16px] focus:outline-none text-9ca3af bg-f3f4f6
            mt-[9px] sm:mt-[16px] resize-none"
          />
          <button
            type="button"
            onClick={commentsPostMutation.mutate}
            disabled={!isPost}
            className={`w-[74px] h-[42px] mt-[16px] rounded-[8px] border-none text-f3f4f6 
          ml-[1126px] md:ml-[622px] sm:ml-[270px]
            ${isPost ? "bg-3692ff" : "bg-9ca3af"}`}
          >
            등록
          </button>
        </form>
        <div className="w-full flex flex-col gap-[24px] sm:gap-[16px] mt-[40px] lg:mt-[24px]">
          {productComments?.map((comment) => (
            <CommentItem
              data={comment}
              onPatch={patchComment}
              onDelete={commentsDeleteMutation.mutate}
              key={comment.id}
            />
          ))}
        </div>
        {tenaryWithEmpty(
          isComments,
          <>
            <div
              className="w-[196px] h-[196px] relative mt-[40px] lg:mt-[24px]
            md:w-[140px] md:h-[140px]
            sm:w-[140px] sm:h=[140px]"
            >
              <Image
                src="/images/Img_inquiry_empty.png"
                layout="fill"
                alt="댓글없을 때 디폴트 이미지"
              />
            </div>
            <span className="mt-[8px] text-9ca3af mb-[48px]">
              아직 문의가 없어요
            </span>
          </>
        )}
        <Link
          className={`w-[240px] h-[48px] flex px-[39.5px] items-center rounded-40px bg-3692ff
            ${isComments ? "" : "mt-[64px] md:mt-[56px] sm:mt-[40px]"}`}
          href="/items"
        >
          <span
            className="w-[129px] h-[26px] text-[18px] mr-[8px] font-semibold
    text-center text-f3f4f6 leading-26px whitespace-nowrap"
          >
            목록으로 돌아가기
          </span>
          <Image
            width={24}
            height={24}
            src="/images/ic_back.png"
            alt="버튼 이미지"
          />
        </Link>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModle}
        onComplete={handleModalComplete}
      />
    </div>
  );
}
