export const SECTIONS = Object.freeze({
  WATCH: "WATCH",
  CHECK: "CHECK",
  SEARCH: "SEARCH",
  REGISTER: "REGISTRER",
  SAFETY: "SAFETY"
});
export const FIELD_TYPES = Object.freeze({
  NAME: "name",
  DESCRIPTION: "description",
  PRICE: "price",
  TAG: "tag",
  EMAIL: "email",
  NICKNAME: "nickname",
  PASSWORD: "password",
  CONFIRMPASSWORD: "confirmPassword"
});
export const VALIDATION_STATE = Object.freeze({
  INITIAL: "INITIAL",
  SUCCESS: "SUCCESS",
  FALSE: "FALSE"
});
export const ORDER_STATE = Object.freeze({
  RECENT: "recent",
  FAVORITEST: "favorite",
  NEWEST: "newest"
});
export const MODEL_TYPE = Object.freeze({
  PRODUCT_LIST: "PRODUCT_LIST",
  PRODUCT_WITH_COMMENTS: "PRODUCT_WITH_COMMENTS",
  ARTICLE_LIST: "ARTICLE_LIST",
  ARTICLE_BEST_LIST: "ARTICLE_BEST_LIST",
  ARTICLE_STANDARD_LIST: "ARTICLE_STANDARD_LIST",
  ARTICLE_WITH_COMMENTS: "ARTICLE_WITH_COMMENTS"
});
export const BUTTON_TYPE = Object.freeze({
  edit: { value: "EDIT", label: "수정하기" },
  delete: { value: "delete", label: " 삭제하기" }
});
export const TOKEN = Object.freeze({
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken"
});
export const CRUDAction = Object.freeze({
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE"
});
