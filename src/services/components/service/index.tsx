import { FunctionComponent } from 'react';
import Service from "../../types/Service";
import ServiceLog from "../log";

interface ServiceItemProps {
    item: Service
}

const ServiceItem: FunctionComponent<ServiceItemProps> = ({ item }) => {
    return (
        <div>
            <div className='flex basis-full'>
                <h1>{item.status === 'success' ? '✅' : '❌'}</h1>
                <h1 className='p-10'>{item.name}</h1>
            </div>

            <div className='flex'>
                {
                    item.logs.map(log => (
                        <div key={log.created_at} className='flex-1'>
                            <ServiceLog item={log} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ServiceItem;