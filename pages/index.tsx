import type { NextPage } from 'next'
import IncidentsSection from "../page-components/incidents"
import ServicesSection from "../page-components/services"

const Home: NextPage = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
      <ServicesSection />
      <IncidentsSection />
    </div>
  )
}

export default Home;
