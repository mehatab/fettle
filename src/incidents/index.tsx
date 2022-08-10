import useIncidents from './hooks/useIncidents'
import type { NextPage } from 'next'
import Incidents from './types/Incident';

const IncidentsSection: NextPage = () => {
    const [incidents, isIncidentsLoading] = useIncidents();
    return (
        <div>
            {
                isIncidentsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {
                            (incidents as Incidents[]).map(incident => (
                                <div className='flex items-center' key={incident.id}>
                                    <p className='text-base font-semibold leading-6 text-gray-900'>{incident.title}</p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default IncidentsSection
