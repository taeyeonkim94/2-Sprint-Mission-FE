import { useState } from "react";
import Image from "next/image";
export default function EditDeleteDropDown({ onDropDownChange, className }) {
  const dropdown = `w-[24px] h-[24px] relative`;
  const dropdownMenuList = `w-[139px] h-[92px] absolute top-[24px] right-0 border-[1px] border-d1d5d8 rounded-[8px]`;
  const dropdownMenu = `w-[139px] h-[46px] flex justify-center items-center text-[16px] text-6b7280`;

  const [isOpen, setIsOpen] = useState(false);
  const [seletedItem, setSeletedItem] = useState(null);
  const toggleDropDown = () => setIsOpen((prev) => !prev);
  const handleItemClick = (item) => {
    setSeletedItem(item);
    setIsOpen(false);
    onDropDownChange(item);
  };
  const items = ["수정하기", "삭제하기"];
  return (
    <div className={`${dropdown} ${className}`}>
      <button onClick={toggleDropDown}>
        <Image
          width={24}
          height={24}
          src="/images/ic_kebab.png"
          alt="버튼 이미지"
        />
      </button>
      {isOpen && (
        <ul className={dropdownMenuList}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              className={dropdownMenu}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
