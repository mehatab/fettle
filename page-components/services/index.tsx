import useIncidents from './hooks/useServices';
import type { NextPage } from 'next'
import Service from './types/Service';

const ServicesSection: NextPage = () => {
    const [data, isPostsLoading] = useIncidents();
    return (
        <div>
            <h1>Services </h1>
            {
                isPostsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {
                            (data as Service[]).map(incident => (
                                <li key={incident.id}>
                                    <h2>{incident.name}</h2>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default ServicesSection;
