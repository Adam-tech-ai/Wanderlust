

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { VacationReportModel } from "../../../models/vacation-report-model";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./reports.css";

// Displays vacation statistics and likes report:
export function Reports() {

    // Report data:
    const [report, setReport] =
        useState<VacationReportModel[]>([]);

    // Load report when component starts:
    useEffect(() => {
        loadReport();
    }, []);

    // Get report from Backend:
    async function loadReport() {
        try {
            const data =
                await dataService.getVacationsReport();

            setReport(data);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Download report as CSV:
    function downloadCsv(): void {

        const header =
            "Destination,Likes\n";

        const rows = report
            .map(item =>
                `"${item.destination.replace(/"/g, '""')}",${item.likesCount}`
            )
            .join("\n");

        const csv =
            header + rows;

        const blob =
            new Blob(
                [csv],
                { type: "text/csv;charset=utf-8;" }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "vacations-likes-report.csv";

        link.click();

        URL.revokeObjectURL(url);
    }

    // Calculate dashboard statistics:
    const totalDestinations = report.length;

    const totalLikes = report.reduce(
        (total, item) => total + item.likesCount,
        0
    );

    // Calculate average likes per destination:
    const averageLikes = totalDestinations > 0
        ? totalLikes / totalDestinations
        : 0;

    // Sort destinations by number of likes:
    const sortedReport = [...report].sort(
        (a, b) => b.likesCount - a.likesCount
    );

    return (
        <div className="Reports">

            {/* Dashboard heading: */}
            <div className="reports-heading">

                <div>
                    <h2>Vacation Analytics</h2>
                    <p>
                        Track destination popularity and
                        vacation engagement.
                    </p>
                </div>

                {/* CSV export button: */}
                <button
                    className="reports-download"
                    onClick={downloadCsv}
                >
                    Download CSV
                </button>

            </div>

            {/* Dashboard statistics: */}
            <div className="reports-stats">

                <div className="reports-stat-card">
                    <span>Total Destinations</span>
                    <strong>{totalDestinations}</strong>
                    <p>Available vacation destinations</p>
                </div>

                <div className="reports-stat-card">
                    <span>Total Likes</span>
                    <strong>{totalLikes}</strong>
                    <p>Likes across all destinations</p>
                </div>

                <div className="reports-stat-card">
                    <span>Average Likes</span>
                    <strong>{averageLikes.toFixed(1)}</strong>
                    <p>Likes per destination</p>
                </div>

            </div>

            {/* Destination popularity chart: */}
            <div className="reports-chart">

                <div className="reports-chart-heading">
                    <h3>Destination Popularity</h3>
                    <p>
                        Number of likes received by each destination
                    </p>
                </div>

                <div className="reports-chart-container">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={sortedReport}
                            margin={{
                                top: 25,
                                right: 20,
                                left: 0,
                                bottom: 65
                            }}
                        >

                            {/* Horizontal grid lines: */}
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5eaf0"
                            />

                            {/* X axis displays destinations: */}
                            <XAxis
                                type="category"
                                dataKey="destination"
                                interval={0}
                                angle={-40}
                                textAnchor="end"
                                height={95}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11 }}
                                stroke="#52657d"
                            />

                            {/* Y axis displays number of likes: */}
                            <YAxis
                                type="number"
                                allowDecimals={false}
                                domain={[0, "dataMax + 1"]}
                                tickLine={false}
                                axisLine={false}
                                stroke="#718096"
                            />

                            {/* Display likes on hover: */}
                            <Tooltip
                                cursor={{ fill: "#f5f8fc" }}
                                formatter={(value) => [
                                    value,
                                    "Likes"
                                ]}
                            />

                            {/* Vertical bars: */}
                            <Bar
                                dataKey="likesCount"
                                name="Likes"
                                fill="#087f8c"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={45}
                            >

                                {/* Display likes above each bar: */}
                                <LabelList
                                    dataKey="likesCount"
                                    position="top"
                                    fill="#142b49"
                                    fontSize={12}
                                />

                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
}
