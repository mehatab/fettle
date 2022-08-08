import { FunctionComponent } from 'react';
import Service from "../../types/Service";
import ServiceLog from "../log";

interface ServiceItemProps {
    item: Service
}

const ServiceItem: FunctionComponent<ServiceItemProps> = ({ item }) => {
    return (
        <div className='max-w-full'>
            <div className='flex'>
                <h1>{item.status === 'success' ? '✅' : '❌'}</h1>
                <h1 className='p-10'>{item.name}</h1>
            </div>

            <div className='flex'>
                {
                    item.logs.map(log => (
                        <div key={log.created_at} className='shrink-0 h-16 w-32'>
                            <ServiceLog item={log} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ServiceItem;