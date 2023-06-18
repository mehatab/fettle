import useIncidents from "./hooks/useIncidents";
import type { NextPage } from "next";
import Incidents from "./types/Incident";
import MonthlyIncident from "./types/MonthlyIncident";

const IncidentsSection: NextPage = () => {
	const [monthlyIncidents, isIncidentsLoading] = useIncidents();

	const formatDate = (date: string) => {
		return new Date(date).toLocaleString([], {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	};

	return (
		<div className="mt-5">
			{isIncidentsLoading ? (
				<p>Loading...</p>
			) : (
				<div>
					{(monthlyIncidents as MonthlyIncident[]).map((incidents) => (
						<div className="mb-10" key={incidents.month}>
							<p className="mr-5 text-2xl font-semibold leading-6 text-gray-900">{incidents.month}</p>
							<div className="mt-2 flex-1 h-px  bg-gray-300" />
							<div className="ml-6 border-l-4">
								{(incidents.incidents as Incidents[]).map((incident) => (
									<div className="flex" key={incident.id}>
										<div className="-ml-4 mt-6 flex rounded-full w-7 h-7 bg-gray-300">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="17"
												viewBox="0 0 14 14"
												fill="none"
												className="m-auto fill-gray-500 text-disrupted"
											>
												<path d="M6.99999 2.3C10.14 2.3 12.7 4.86 12.7 8C12.7 11.14 10.14 13.7 6.99999 13.7C3.85999 13.7 1.29999 11.14 1.29999 8C1.29999 4.86 3.85999 2.3 6.99999 2.3ZM7 1C3.14 1 0 4.14 0 8C0 11.86 3.14 15 7 15C10.86 15 14 11.86 14 8C14 4.14 10.86 1 7 1ZM8 4H6V9H8V4ZM8 10H6V12H8V10Z" />
											</svg>
										</div>
										<div className="items-center ml-3 mt-6">
											<p className="text-base font-semibold leading-6 text-gray-900">
												{incident.title}
											</p>
											{incident.status === "closed" ? (
												<div>
													<p className="text-sm text-gray-500">
														This incident has been resolved.
													</p>
													<p className="text-sm text-gray-500">
														{formatDate(incident.created_at)} -{" "}
														{formatDate(incident.closed_at)}
													</p>
												</div>
											) : (
												<div>
													<p className="text-sm text-gray-500">
														This incident is currently being investigated.
													</p>
													<p className="text-sm text-gray-500">
														{formatDate(incident.created_at)}
													</p>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default IncidentsSection;
