import type { NextPage } from 'next'
import IncidentsSection from "../src/incidents"
import ServicesSection from "../src/services"

const Home: NextPage = () => {
  return (
    <div className="bg-white ">

      <div className='jsx-2876871543 relative flex-grow w-full mx-auto'>

        <div className="w-full md:w-7/12 pt-5 px-4 mx-auto text-center">
          <div className="text-sm text-black py-1">
            This components requires
            for the shadows, ripple effects and card classes. <br /><br />
            A component by
          </div>
        </div>
        <ServicesSection />
      </div >
    </div>
  )
}

export default Home;
