import type { NextPage } from 'next'
import { FunctionComponent } from 'react';
import Log from '../../types/Log';

interface ServiceLogProps {
    item: Log
}

const ServiceLog: FunctionComponent<ServiceLogProps> = ({ item }) => {
    return (
        <div className='bg-green-500 ml-0.5 sm:rounded-lg flex-1 h-8' />
    )
}

export default ServiceLog;