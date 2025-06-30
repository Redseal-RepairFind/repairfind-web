import FilterSearch from "./filter-contractors";
import HeroSection from "./hero-section";
import PopularJobs from "./popular-jobs";

const Mhome = ({ data }: { data: any }) => {
  return (
    <div className="w-full column gap-8 mb-8">
      <HeroSection />
      <div className="vertical-space">
        <FilterSearch />
      </div>

      <PopularJobs data={data} />
    </div>
  );
};

export default Mhome;
