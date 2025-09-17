import Navbar from "@/components/home/Navbar";
import Portfolio from "@/components/home/Portfolio";
import WatchList from "@/components/home/WatchList";

const HomePage = () => {
  return (
    <div className="p-2 font-inter h-screen">
      <Navbar />
      <Portfolio />
      <WatchList />
    </div>
  );
};

export default HomePage;
