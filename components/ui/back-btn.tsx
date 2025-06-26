import { useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

const BackBtn = ({ name, route }: { name: string; route?: string }) => {
  const router = useRouter();

  const handleNav = () => {
    if (route) {
      router.push(route);
      return;
    }
    router.back();
  };
  return (
    <button
      className="px-4 py-2 bg-white shadow-md rounded-md flex items-center gap-2 cursor-pointer hover:bg-mygray-200 duration-300 transition-all"
      onClick={handleNav}
    >
      <BiChevronLeft />
      <p>{name}</p>
    </button>
  );
};

export default BackBtn;
