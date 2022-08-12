import useIncidents from './hooks/useIncidents'
import type { NextPage } from 'next'
import Incidents from './types/Incident';
import MonthlyIncident from './types/MonthlyIncident';

const IncidentsSection: NextPage = () => {
    const [monthlyIncidents, isIncidentsLoading] = useIncidents();
    return (
        <div className='mt-5'>
            {
                isIncidentsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {
                            (monthlyIncidents as MonthlyIncident[]).map(incidents => (
                                <div key={incidents.month}>
                                    <div className='flex items-center'>
                                        <p className='mr-5 text-xl font-semibold leading-6 text-gray-900'>{incidents.month}</p>
                                        <div className='flex-1 h-px  bg-gray-300' />
                                    </div>
                                    <div className='mt-5'>
                                        {
                                            (incidents.incidents as Incidents[]).map(incident => (
                                                <div className='items-center mt-5' key={incident.id}>
                                                    <div className='flex justify-between'>
                                                        <div>
                                                            <p className='text-base font-semibold leading-6 text-gray-900'>{incident.title}</p>
                                                        </div>
                                                        <p className='text-sm text-gray-500'>Resolved {incident.closed_at}</p>
                                                    </div>
                                                    <p className='text-sm text-gray-500'>Reported at {incident.created_at}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
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
