import Header from "@/components/ui/header";
import Image from "next/image";

const SuccessPage = () => {
  return (
    <div className="w-full h-screen flex-center">
      <div className="column gap-2 items-center">
        <div className="w-[300px] h-[300px] relative">
          <Image
            src="/images/Feedback().gif"
            alt="No contractors"
            className=""
            fill
          />
        </div>
        <Header header="Job listed" shade="dark" variant="h1" />
        <p>Please keep an eye on your mail to see your bids</p>
      </div>
    </div>
  );
};

export default SuccessPage;
