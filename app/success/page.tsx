import Header from "@/components/ui/header";

const SuccessPage = () => {
  return (
    <div className="w-full h-[60vh] flex-center">
      <div className="column gap-2 items-center">
        <Header header="Job listed" shade="dark" variant="h3" />
        <p>Please keep an eye on your mail to see your bids</p>
      </div>
    </div>
  );
};

export default SuccessPage;
