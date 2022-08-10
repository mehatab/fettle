import type { NextPage } from 'next'
import Image from 'next/image'
import IncidentsSection from "../src/incidents"
import ServicesSection from "../src/services"

const Home: NextPage = () => {
  return (
    <div className='h-full w-full '>
      <div className="w-full h-80 absolute bg-light-purple dark:purple dark:bg-black">
        <div className="mx-px mt-10 md:pl-80 md:pr-80 w-full h-full bg-purple-500 dark:bg-black">
          <Image src="/vercel.svg" width={150} height={100} className="w-40 h-16" alt="Tailwind Play" />
        </div>
      </div>
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className='mt-40 w-full absolute overflow-scroll	'>
        <ServicesSection />
      </div >
    </div>
  )
}

export default Home;
