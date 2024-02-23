import type { NextPage } from "next";
import Image from "next/image";
import IncidentsSection from "../src/incidents";
import ServicesSection from "../src/services";

const Home: NextPage = () => {
  return (
    <div className="h-full w-full ">
      <div className="mt-20 absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="w-full h-40 absolute bg-blue-900 dark:blue dark:bg-black">
        <div className="sm:ml-0 ml-5 mr-0 mt-3 md:pl-80 md:pr-80 sm:w-full h-full bg-blue-900 dark:bg-black">
          <Image
            src="/aaf.png"
            width={200}
            height={100}
            className="w-40 h-16"
            alt="Tailwind Play"
          />
        </div>
      </div>
      <div className="mt-20 w-full absolute overflow-scroll	">
        <ServicesSection />
      </div>
    </div>
  );
};

export default Home;
