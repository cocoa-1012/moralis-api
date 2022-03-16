import logoImg from "../assets/images/logo.png";
import searchImg from "../assets/images/search.png";
export const Header = () => {
  return (
    <div className="absolute flex justify-between w-full items-center p-4">
      <img className="w-[100px] cursor-pointer" src={logoImg} alt="logo" />
      <div className="relative">
        <img
          src={searchImg}
          alt="search"
          className="absolute w-8 top-1 left-1 cursor-pointer"
        />
        <input
          className="h-10 w-[450px] pl-10 pr-4 rounded-3xl focus:outline-none text-xl"
          type="search"
        />
      </div>

      <div className="flex">
        <button className="text-white mx-6 hover:underline" type="button">
          About Us
        </button>
        <button className="text-white mx-6 hover:underline" type="button">
          Contact Us
        </button>
        <button className="text-white mx-6 hover:underline" type="button">
          More
        </button>
      </div>
    </div>
  );
};
