import useHealthChecksUIServices from './hooks/useHealthChecksUIServices';
import type { NextPage } from 'next'
import ServiceItem from './components/service';
import useSystemStatus from './hooks/useSystemStatus';
import { Status, URL_HEALTHCHECKS_UI_API } from '../utils/constants';

const Nbsp = () => {
    return <>&nbsp;</>
}

const ServicesSection: NextPage = () => {
    // TODO: Error handling
    const { services, isLoading: isServicesLoading, error } = useHealthChecksUIServices(URL_HEALTHCHECKS_UI_API);
    const {systemStatus, isLoading} = useSystemStatus(services);

    const Icon = () => {
        if (systemStatus?.status === Status.OPERATIONAL) {
            return <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
        } else if(systemStatus?.status === Status.PARTIAL_OUTAGE) {
            return <svg  className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="orange">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else if(systemStatus?.status === Status.OUTAGE) {
            return <svg className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else {
            return <svg className="h-6 w-6 flex-none fill-gray-100 stroke-gray-200 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                        </svg>
        }
    }

    return (
        <div className='mt-2 px-2'>
            <div className="mx-auto max-w-lg bg-white dark:bg-slate-800 rounded-xl card">
                <div className="w-full flex justify-between items-center pt-2 px-6 pb-2">
                    <div className='flex items-center text-xl font-semibold leading-7'>
                        <Icon />
                        <p className={["ml-2", systemStatus ? "text-gray-900" : "text-gray-400"].join(" ")}>{systemStatus?.title ?? "Loading..."}</p>                        
                    </div>
                    <div>
                        <p className="text-right text-xs text-gray-400 whitespace-nowrap">{systemStatus ? "Last updated" : <Nbsp />}</p>
                        <p className="text-right text-xs text-gray-400 text-end whitespace-nowrap">{systemStatus?.datetime ?? <Nbsp />}</p>
                    </div>
                </div>
            </div>
            <div className="mx-px my-10 md:mx-10 lg:mx-40 xl:mx-80 2xl:mx-96">
                <div className="card-body">
                    {
                        isServicesLoading || !services ? (
                            // <p>Loading...</p>
                            <></>
                        ) : (
                            <ul>
                                {
                                    services.map(service => (
                                        <ServiceItem key={service.id} item={service} />
                                    ))
                                }
                            </ul>
                        )
                    }
                </div>
                {/* <p className="mt-10 sm:text-lg	text-base font-semibold leading-7 text-gray-900">Recent incident</p> */}
                {/* <IncidentsSection /> */}
            </div>
        </div >
    )
}

export default ServicesSection;
