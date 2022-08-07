import type { NextPage } from 'next'
import useRequest from '../common/hooks/useRequest'
import IncidentsSection from "../page-components/incidents"

const Home: NextPage = () => {
  const [data, isPostsLoading, error] = useRequest(
    "https://api.github.com/repos/aws/aws-cdk/issues"
  );
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
      <IncidentsSection />
    </div>
  )
}

export default Home;
