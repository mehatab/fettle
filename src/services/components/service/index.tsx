import { FunctionComponent } from 'react';
import { Status } from '../../../utils/constants';
import Log from '../../types/Log';
import LogDaySummary from '../../types/LogDaySummary';
import Service from "../../types/Service";
import ServiceLog from "../log";

interface ServiceItemProps {
    item: Service
}

const ServiceItem: FunctionComponent<ServiceItemProps> = ({ item }) => {
    const Icon = () => {
        if (item?.status === Status.OPERATIONAL) {
            return <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
        } else if(item?.status === Status.PARTIAL_OUTAGE) {
            return <svg  className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="orange">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else if(item?.status === Status.OUTAGE) {
            return <svg className="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                    </svg>
        } else {
            return <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                            <circle cx="12" cy="12" r="11" />
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
        }
    }

    const calculateUpTime = () => {
        let successCount = item.logs.filter((item)=> item.status === Status.OPERATIONAL).length
        return Math.round((successCount * 100) / 90);
    }

    return (
        <div className='mb-10'>
            <div className='flex'>
                <Icon />
                <div className="w-full flex justify-between items-baseline">
                    <p className="ml-4 text-base font-semibold leading-6 text-gray-900">{item.name}</p>
                    <p className='text-xs text-gray-400 items-baseline	self-baseline'> {calculateUpTime()}% operational in last 90 days</p>
                </div>

            </div>
            <div className='flex mt-2'>
                {
                    ((item.logs || []) as LogDaySummary[]).map((log) => (
                        <ServiceLog key={log.date} item={log} />
                    ))
                }
            </div>

        </div>
    )
}

export default ServiceItem;