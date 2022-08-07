import useIncidents from './hooks/useServices';
import type { NextPage } from 'next'
import Service from './types/Service';
import ServiceItem from './components/service';

const ServicesSection: NextPage = () => {
    const [data, isPostsLoading] = useIncidents();
    return (
        <div>
            <div className="overflow-y-scroll h-72 relative max-w-sm mx-auto bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col divide-y dark:divide-slate-200/5">
                <div className="card">
                    <div className="card-body">
                        All System operational
                    </div>
                </div>
            </div>
            <div className="overflow-y-scroll h-72 relative max-w-sm mx-auto bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col divide-y dark:divide-slate-200/5">
                <div className="card">
                    <div className="card-body">
                        {
                            isPostsLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <ul>
                                    {
                                        (data as Service[]).map(service => (
                                            <ServiceItem key={service.id} item={service} />
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesSection;
