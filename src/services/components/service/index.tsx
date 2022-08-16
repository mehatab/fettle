import { FunctionComponent } from 'react';
import Log from '../../types/Log';
import LogDaySummary from '../../types/LogDaySummary';
import Service from "../../types/Service";
import ServiceLog from "../log";

interface ServiceItemProps {
    item: Service
}

const ServiceItem: FunctionComponent<ServiceItemProps> = ({ item }) => {
    return (
        <div className='mb-10'>
            <div className='flex'>
                <svg className="h-6 w-6 flex-none fill-sky-100 stroke-green-500 stroke-2">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                </svg>
                <div className="w-full flex justify-between items-baseline">
                    <p className="ml-4 text-base font-semibold leading-6 text-gray-900">{item.name}</p>
                    <p className='text-xs text-gray-400 items-baseline	self-baseline'> 100% operational in last 90 days</p>
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