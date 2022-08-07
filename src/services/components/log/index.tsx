import type { NextPage } from 'next'
import { FunctionComponent } from 'react';
import Log from '../../types/Log';

interface ServiceLogProps {
    item: Log
}

const ServiceLog: FunctionComponent<ServiceLogProps> = ({ item }) => {
    return (
        <div>
            {item.status === 'success' ? '✅' : '❌'}
        </div>
    )
}

export default ServiceLog;