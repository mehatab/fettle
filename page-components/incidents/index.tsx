import useIncidents from './hooks/useIncidents'
import type { NextPage } from 'next'
import Incidents from './types/Incidents';

const IncidentsSection: NextPage = () => {
    const [data, isPostsLoading] = useIncidents(
        "https://api.github.com/repos/aws/aws-cdk/issues"
    );
    return (
        <div>
            <h1>Incidents </h1>
            {
                isPostsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {
                            (data as Incidents[]).map(incident => (
                                <li key={incident.id}>
                                    <h2>{incident.title}</h2>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default IncidentsSection
